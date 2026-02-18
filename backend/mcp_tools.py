from typing import Optional, List, Literal, Dict, Any
from uuid import UUID
from datetime import datetime, timezone
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import Task, TaskCreate, TaskUpdate

# --- Tool Implementations ---

async def add_task(
    session: AsyncSession, 
    user_id: str, 
    title: str, 
    description: Optional[str] = None,
    priority: str = "medium",
    category: str = "General",
    due_date: Optional[str] = None,
    is_recurring: bool = False,
    recurrence_pattern: Optional[str] = None
) -> Dict[str, Any]:
    """Creates a new todo item."""
    parsed_due_date = None
    if due_date:
        try:
            parsed_due_date = datetime.fromisoformat(due_date.replace("Z", "+00:00"))
        except ValueError:
            pass

    task_in = TaskCreate(
        title=title, 
        description=description,
        priority=priority,
        category=category,
        due_date=parsed_due_date,
        is_recurring=is_recurring,
        recurrence_pattern=recurrence_pattern
    )
    db_task = Task.model_validate(task_in, update={"user_id": user_id})
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return {
        "task_id": str(db_task.id),
        "status": "created",
        "title": db_task.title
    }

async def list_tasks(
    session: AsyncSession, 
    user_id: str, 
    status: str = "all", 
    priority: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> List[Dict[str, Any]]:
    """Retrieves tasks."""
    statement = select(Task).where(Task.user_id == user_id)
    
    if status == "pending":
        statement = statement.where(Task.is_completed == False)
    elif status == "completed":
        statement = statement.where(Task.is_completed == True)
    
    if priority:
        statement = statement.where(Task.priority == priority)
    
    if category:
        statement = statement.where(Task.category.ilike(f"%{category}%"))

    if search:
        statement = statement.where(
            (Task.title.ilike(f"%{search}%")) | (Task.description.ilike(f"%{search}%"))
        )
    
    order_col = getattr(Task, sort_by, Task.created_at)
    if sort_order == "desc":
        statement = statement.order_by(order_col.desc())
    else:
        statement = statement.order_by(order_col.asc())
        
    results = await session.execute(statement)
    tasks = results.scalars().all()
    
    return {
        "tasks": [
            {
                "id": str(t.id),
                "title": t.title,
                "completed": t.is_completed,
                "priority": t.priority,
                "category": t.category
            }
            for t in tasks
        ]
    }

async def complete_task(session: AsyncSession, user_id: str, task_id: str) -> Dict[str, Any]:
    """Marks a task as completed."""
    try:
        uuid_id = UUID(task_id)
    except ValueError:
        return {"error": "Invalid task ID format"}

    statement = select(Task).where(Task.id == uuid_id, Task.user_id == user_id)
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        return {"error": f"Task {task_id} not found"}
        
    db_task.is_completed = True
    db_task.updated_at = datetime.now(timezone.utc)
    
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return {"status": "completed", "title": db_task.title}

async def delete_task(session: AsyncSession, user_id: str, task_id: str) -> Dict[str, Any]:
    """Removes a task."""
    try:
        uuid_id = UUID(task_id)
    except ValueError:
        return {"error": "Invalid task ID format"}

    statement = select(Task).where(Task.id == uuid_id, Task.user_id == user_id)
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        return {"error": f"Task {task_id} not found"}
        
    await session.delete(db_task)
    await session.commit()
    return {"status": "deleted", "task_id": task_id}

async def update_task(
    session: AsyncSession, 
    user_id: str, 
    task_id: str, 
    title: Optional[str] = None, 
    description: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    due_date: Optional[str] = None,
    is_completed: Optional[bool] = None
) -> Dict[str, Any]:
    """Modifies a task."""
    try:
        uuid_id = UUID(task_id)
    except ValueError:
        return {"error": "Invalid task ID format"}

    statement = select(Task).where(Task.id == uuid_id, Task.user_id == user_id)
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        return {"error": f"Task {task_id} not found"}
    
    if title is not None: db_task.title = title
    if description is not None: db_task.description = description
    if priority is not None: db_task.priority = priority
    if category is not None: db_task.category = category
    if is_completed is not None: db_task.is_completed = is_completed
    
    if due_date is not None:
        try:
            db_task.due_date = datetime.fromisoformat(due_date.replace("Z", "+00:00"))
        except ValueError:
            pass
        
    db_task.updated_at = datetime.now(timezone.utc)
    
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return {"status": "updated", "title": db_task.title}

# --- Gemini Tool Definitions ---
# Simplified format which is most reliable
GEMINI_TOOLS = [
    {
        "name": "add_task",
        "description": "Creates a new todo item.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "title": {"type": "STRING"},
                "priority": {"type": "STRING", "enum": ["low", "medium", "high"]},
                "category": {"type": "STRING"},
                "due_date": {"type": "STRING"}
            },
            "required": ["title"]
        }
    },
    {
        "name": "list_tasks",
        "description": "Retrieves tasks.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "search": {"type": "STRING"}
            }
        }
    },
    {
        "name": "complete_task",
        "description": "Marks a task as completed.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "task_id": {"type": "STRING"}
            },
            "required": ["task_id"]
        }
    },
    {
        "name": "delete_task",
        "description": "Permanently removes a task.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "task_id": {"type": "STRING"}
            },
            "required": ["task_id"]
        }
    },
    {
        "name": "update_task",
        "description": "Modifies an existing task.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "task_id": {"type": "STRING"},
                "title": {"type": "STRING"},
                "priority": {"type": "STRING", "enum": ["low", "medium", "high"]},
                "category": {"type": "STRING"}
            },
            "required": ["task_id"]
        }
    }
]

# Map tool names to functions
TOOL_FUNCTIONS = {
    "add_task": add_task,
    "list_tasks": list_tasks,
    "complete_task": complete_task,
    "delete_task": delete_task,
    "update_task": update_task
}
