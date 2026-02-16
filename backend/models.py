from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, String, Boolean, DateTime, Text

# Better Auth required tables

class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    email_verified: bool = Field(default=False, sa_column=Column("emailVerified", Boolean, default=False))
    image: Optional[str] = Field(default=None, sa_column=Column("image", Text, nullable=True))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("createdAt", DateTime, default=datetime.now(timezone.utc)))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("updatedAt", DateTime, default=datetime.now(timezone.utc)))
    
    tasks: List["Task"] = Relationship(back_populates="user")

class Account(SQLModel, table=True):
    id: str = Field(primary_key=True)
    user_id: str = Field(sa_column=Column("userId", String, nullable=False))
    account_id: str = Field(sa_column=Column("accountId", String, nullable=False))
    provider_id: str = Field(sa_column=Column("providerId", String, nullable=False))
    access_token: Optional[str] = Field(default=None, sa_column=Column("accessToken", Text, nullable=True))
    refresh_token: Optional[str] = Field(default=None, sa_column=Column("refreshToken", Text, nullable=True))
    expires_at: Optional[datetime] = Field(default=None, sa_column=Column("expiresAt", DateTime, nullable=True))
    password: Optional[str] = Field(default=None, sa_column=Column("password", Text, nullable=True))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("createdAt", DateTime, default=datetime.now(timezone.utc)))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("updatedAt", DateTime, default=datetime.now(timezone.utc)))

class Session(SQLModel, table=True):
    id: str = Field(primary_key=True)
    user_id: str = Field(sa_column=Column("userId", String, nullable=False))
    token: str = Field(unique=True)
    expires_at: datetime = Field(sa_column=Column("expiresAt", DateTime, nullable=False))
    ip_address: Optional[str] = Field(default=None, sa_column=Column("ipAddress", String, nullable=True))
    user_agent: Optional[str] = Field(default=None, sa_column=Column("userAgent", Text, nullable=True))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("createdAt", DateTime, default=datetime.now(timezone.utc)))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("updatedAt", DateTime, default=datetime.now(timezone.utc)))

class Verification(SQLModel, table=True):
    id: str = Field(primary_key=True)
    identifier: str
    value: str
    expires_at: datetime = Field(sa_column=Column("expiresAt", DateTime, nullable=False))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("createdAt", DateTime, default=datetime.now(timezone.utc)))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("updatedAt", DateTime, default=datetime.now(timezone.utc)))

# Task Management Models

from enum import Enum

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskBase(SQLModel):
    title: str = Field(index=True)
    description: Optional[str] = None
    is_completed: bool = Field(default=False, index=True)
    priority: str = Field(default="medium", index=True)
    category: Optional[str] = Field(default="General", index=True)
    due_date: Optional[datetime] = Field(default=None, index=True)
    is_recurring: bool = Field(default=False)
    recurrence_pattern: Optional[str] = None # e.g., "daily", "weekly", "monthly"

class Task(TaskBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    user: Optional[User] = Relationship(back_populates="tasks")

class TaskCreate(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[datetime] = None
    is_recurring: Optional[bool] = None
    recurrence_pattern: Optional[str] = None

class TaskRead(TaskBase):
    id: UUID
    user_id: str
    created_at: datetime
    updated_at: datetime

# Chatbot Models

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    messages: List["Message"] = Relationship(back_populates="conversation")

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id", index=True)
    user_id: str = Field(index=True)
    role: str # "user", "assistant"
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    conversation: Optional[Conversation] = Relationship(back_populates="messages")
