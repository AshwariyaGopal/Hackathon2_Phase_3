from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, col
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timezone

from db import get_session
from models import Task, TaskCreate, TaskUpdate, TaskRead
from middleware.jwt_auth import get_current_user

import logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tasks")

@router.post("", response_model=TaskRead, status_code=201)
async def create_task(
    *,
    session: AsyncSession = Depends(get_session),
    task_in: TaskCreate,
    current_user: dict = Depends(get_current_user)
):
    try:
        db_task = Task.model_validate(task_in, update={"user_id": current_user["id"]})
        session.add(db_task)
        await session.commit()
        await session.refresh(db_task)
        return db_task
    except Exception as e:
        logger.error(f"Error creating task: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[TaskRead])
async def list_tasks(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    status: str = Query("all", enum=["all", "pending", "completed"]),
    priority: Optional[str] = Query(None, enum=["low", "medium", "high"]),
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query("created_at", enum=["created_at", "title", "due_date", "priority"]),
    sort_order: str = Query("desc", enum=["asc", "desc"])
):
    try:
        user_id = current_user["id"]
        logger.info(f"Fetching tasks for user {user_id} with filters: status={status}, priority={priority}, search={search}")
        
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
        
        # Sorting logic
        order_col = getattr(Task, sort_by, Task.created_at)
        if sort_order == "desc":
            statement = statement.order_by(order_col.desc())
        else:
            statement = statement.order_by(order_col.asc())
            
        results = await session.execute(statement)
        tasks = results.scalars().all()
        logger.info(f"Successfully fetched {len(tasks)} tasks")
        return tasks
    except Exception as e:
        logger.error(f"CRITICAL: Error in list_tasks: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{id}", response_model=TaskRead)
async def get_task(
    *,
    session: AsyncSession = Depends(get_session),
    id: UUID,
    current_user: dict = Depends(get_current_user)
):
    statement = select(Task).where(Task.id == id, Task.user_id == current_user["id"])
    result = await session.execute(statement)
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{id}", response_model=TaskRead)
async def update_task(
    *,
    session: AsyncSession = Depends(get_session),
    id: UUID,
    task_in: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    statement = select(Task).where(Task.id == id, Task.user_id == current_user["id"])
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task_data = task_in.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)
    
    db_task.updated_at = datetime.now(timezone.utc)
    
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.patch("/{id}/complete", response_model=TaskRead)
async def toggle_task_complete(
    *,
    session: AsyncSession = Depends(get_session),
    id: UUID,
    current_user: dict = Depends(get_current_user)
):
    statement = select(Task).where(Task.id == id, Task.user_id == current_user["id"])
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db_task.is_completed = not db_task.is_completed
    db_task.updated_at = datetime.now(timezone.utc)
    
    # Handle Recurring Tasks
    if db_task.is_completed and db_task.is_recurring and db_task.due_date:
        from datetime import timedelta
        new_due_date = db_task.due_date
        if db_task.recurrence_pattern == "daily":
            new_due_date += timedelta(days=1)
        elif db_task.recurrence_pattern == "weekly":
            new_due_date += timedelta(weeks=1)
        elif db_task.recurrence_pattern == "monthly":
            # Simple month add (30 days)
            new_due_date += timedelta(days=30)
            
        new_task = Task(
            title=db_task.title,
            description=db_task.description,
            user_id=db_task.user_id,
            priority=db_task.priority,
            category=db_task.category,
            due_date=new_due_date,
            is_recurring=True,
            recurrence_pattern=db_task.recurrence_pattern
        )
        session.add(new_task)
    
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.delete("/{id}", status_code=204)
async def delete_task(
    *,
    session: AsyncSession = Depends(get_session),
    id: UUID,
    current_user: dict = Depends(get_current_user)
):
    statement = select(Task).where(Task.id == id, Task.user_id == current_user["id"])
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    await session.delete(db_task)
    await session.commit()
    return None