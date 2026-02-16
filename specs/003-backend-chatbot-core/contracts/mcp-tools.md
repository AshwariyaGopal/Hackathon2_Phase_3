# MCP Tool Definitions

These tools are exposed to the Gemini Agent. All tools implicitly receive the `user_id` from the context; the agent does NOT need to hallucinate it, but the implementation MUST enforce it.

## 1. `add_task`
Creates a new todo item.
- **Parameters**:
  - `title` (str, required): The task content.
  - `description` (str, optional): Additional details.
- **Returns**: JSON
  ```json
  {
    "task_id": 123,
    "status": "created",
    "title": "Buy milk"
  }
  ```

## 2. `list_tasks`
Retrieves tasks for the current user.
- **Parameters**:
  - `status` (str, optional): Filter by "all", "pending", or "completed". Default "all".
- **Returns**: JSON Array
  ```json
  [
    { "id": 1, "title": "Buy milk", "completed": false },
    { "id": 2, "title": "Walk dog", "completed": true }
  ]
  ```

## 3. `complete_task`
Marks a task as completed.
- **Parameters**:
  - `task_id` (int, required): ID of the task to complete.
- **Returns**: JSON
  ```json
  {
    "task_id": 123,
    "status": "completed",
    "title": "Buy milk"
  }
  ```

## 4. `delete_task`
Permanently removes a task.
- **Parameters**:
  - `task_id` (int, required): ID of the task to delete.
- **Returns**: JSON
  ```json
  {
    "task_id": 123,
    "status": "deleted",
    "title": "Buy milk"
  }
  ```

## 5. `update_task`
Modifies an existing task.
- **Parameters**:
  - `task_id` (int, required): ID of the task.
  - `title` (str, optional): New title.
  - `description` (str, optional): New description.
- **Returns**: JSON
  ```json
  {
    "task_id": 123,
    "status": "updated",
    "title": "Buy oat milk"
  }
  ```
