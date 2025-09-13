from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import analytics, tutor

app = FastAPI()

# Enable CORS so the Next.js frontend (http://localhost:3000) can reach this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analytics.router)
app.include_router(tutor.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "UALF API running"}
