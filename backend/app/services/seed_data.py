# Guarantee YDP faculty account exists with faculty123 password
    ydp_user = db.query(User).filter(User.username == "ydp").first()
    if not ydp_user:
        ydp_user = User(
            username="ydp",
            email="ydp.cse@acet.ac.in",
            full_name="Prof. Y.D.P (Faculty, CSE)",
            hashed_password=get_password_hash("faculty123"),
            role=UserRole.FACULTY.value,
            is_active=True,
        )
        db.add(ydp_user)
        db.commit()
    else:
        ydp_user.hashed_password = get_password_hash("faculty123")
        db.commit()

    # Guarantee faculty_alan exists with faculty123 password
    alan_user = db.query(User).filter(User.username == "faculty_alan").first()
    if not alan_user:
        alan_user = User(
            username="faculty_alan",
            email="alan.cse@acet.ac.in",
            full_name="Dr. Alan Turing (Faculty, CSE)",
            hashed_password=get_password_hash("faculty123"),
            role=UserRole.FACULTY.value,
            is_active=True,
        )
        db.add(alan_user)
        db.commit()
    else:
        alan_user.hashed_password = get_password_hash("faculty123")
        db.commit()