# Comprehensive CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://it-helpdesk-system-2m9r.vercel.app",
        "https://it-helpdesk-system-3xy4.vercel.app",
        "https://it-helpdesk-system-sigma.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)