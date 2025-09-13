from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENV: str = Field(default="dev")
    CORS_ORIGINS: str = Field(default="http://localhost:3000,http://localhost:3001")
    READINESS_STRICT: bool = Field(default=False)
    class Config:
        env_file = ".env"
        extra = "ignore"
