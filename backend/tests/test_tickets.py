def test_create_asset_success(client):
    """Tests creating an asset (HTTP 201)."""
    payload = {
        "asset_name": "Dell Desktop Lab 01",
        "asset_type": "Desktop",
        "serial_number": "DEMO-DESK-001",
        "location": "Lab 1",
        "department": "CSE",
        "purchase_date": "2026-01-15",
        "status": "Working",
        "assigned_person": "IT Support",
        "notes": "Demo asset for testing"
    }
    response = client.post("/api/v1/assets", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["asset_id"].startswith("AST-")
    assert data["asset_name"] == "Dell Desktop Lab 01"
    assert data["status"] == "Working"


def test_get_all_assets_paginated(client):
    """Tests paginated asset retrieval (HTTP 200)."""
    response = client.get("/api/v1/assets")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "total_pages" in data


def test_get_single_asset_by_id(client):
    """Tests fetching asset by asset_id (HTTP 200)."""
    create_resp = client.post("/api/v1/assets", json={
        "asset_name": "HP LaserJet Printer",
        "asset_type": "Printer",
        "serial_number": "HP-TEST-998",
        "location": "Admin Office",
        "status": "Working"
    })
    asset_id = create_resp.json()["asset_id"]

    response = client.get(f"/api/v1/assets/{asset_id}")
    assert response.status_code == 200
    assert response.json()["asset_id"] == asset_id


def test_update_asset(client):
    """Tests updating asset fields (HTTP 200)."""
    create_resp = client.post("/api/v1/assets", json={
        "asset_name": "Epson EB-X49",
        "asset_type": "Projector",
        "serial_number": "EP-PROJ-101",
        "location": "Seminar Hall",
        "status": "Working"
    })
    asset_id = create_resp.json()["asset_id"]

    update_payload = {
        "status": "Under Maintenance",
        "location": "Repair Center",
        "notes": "Lamp replacement"
    }
    update_resp = client.put(f"/api/v1/assets/{asset_id}", json=update_payload)
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert data["status"] == "Under Maintenance"
    assert data["location"] == "Repair Center"


def test_delete_asset(client):
    """Tests deleting an asset (HTTP 200)."""
    create_resp = client.post("/api/v1/assets", json={
        "asset_name": "Old Switch",
        "asset_type": "Switch",
        "serial_number": "SW-OLD-404",
        "location": "Storage",
        "status": "Out of Service"
    })
    asset_id = create_resp.json()["asset_id"]

    del_resp = client.delete(f"/api/v1/assets/{asset_id}")
    assert del_resp.status_code == 200

    # Verify 404
    get_resp = client.get(f"/api/v1/assets/{asset_id}")
    assert get_resp.status_code == 404
    assert get_resp.json()["detail"] == "Asset not found"


def test_asset_not_found(client):
    """Tests 404 for non-existent asset ID."""
    response = client.get("/api/v1/assets/AST-9999-9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Asset not found"


def test_duplicate_serial_number_prevention(client):
    """Tests 400 Bad Request when duplicate serial number is submitted."""
    client.post("/api/v1/assets", json={
        "asset_name": "Laptop Alpha",
        "asset_type": "Laptop",
        "serial_number": "UNIQUE-SN-777",
        "location": "Lab 1"
    })

    # Duplicate serial number
    dup_resp = client.post("/api/v1/assets", json={
        "asset_name": "Laptop Beta",
        "asset_type": "Laptop",
        "serial_number": "UNIQUE-SN-777",
        "location": "Lab 2"
    })
    assert dup_resp.status_code == 400
    assert "already exists" in dup_resp.json()["detail"]


def test_search_assets(client):
    """Tests search across name and location."""
    client.post("/api/v1/assets", json={
        "asset_name": "Cisco Catalyst 2960",
        "asset_type": "Switch",
        "serial_number": "CS-SW-551",
        "location": "Server Room Rack 2"
    })
    resp = client.get("/api/v1/assets?search=catalyst")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 1
    assert "Catalyst" in data["items"][0]["asset_name"]


def test_filter_assets_by_type(client):
    """Tests filtering by asset_type."""
    client.post("/api/v1/assets", json={
        "asset_name": "Core Router A",
        "asset_type": "Router",
        "serial_number": "RT-CORE-01",
        "location": "Server Room"
    })
    resp = client.get("/api/v1/assets?asset_type=Router")
    assert resp.status_code == 200
    data = resp.json()
    assert all(a["asset_type"] == "Router" for a in data["items"])


def test_filter_assets_by_status(client):
    """Tests filtering by status."""
    client.post("/api/v1/assets", json={
        "asset_name": "Defective Monitor",
        "asset_type": "Other",
        "serial_number": "DF-MON-002",
        "location": "Storage",
        "status": "Out of Service"
    })
    resp = client.get("/api/v1/assets?status=Out of Service")
    assert resp.status_code == 200
    data = resp.json()
    assert all(a["status"] == "Out of Service" for a in data["items"])


def test_combined_asset_filters(client):
    """Tests combining search, type, and status filters."""
    client.post("/api/v1/assets", json={
        "asset_name": "Lenovo ThinkPad IT-02",
        "asset_type": "Laptop",
        "serial_number": "THINK-IT-02",
        "location": "IT Department",
        "status": "Working"
    })
    resp = client.get("/api/v1/assets?search=ThinkPad&asset_type=Laptop&status=Working")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) >= 1
    assert data["items"][0]["asset_type"] == "Laptop"


def test_asset_pagination(client):
    """Tests asset pagination parameters."""
    for i in range(4):
        client.post("/api/v1/assets", json={
            "asset_name": f"Batch PC {i}",
            "asset_type": "Desktop",
            "serial_number": f"BATCH-SN-{i}",
            "location": "Lab 5"
        })

    resp = client.get("/api/v1/assets?page=1&limit=2")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 2
    assert data["limit"] == 2


def test_asset_sorting(client):
    """Tests sorting assets by asset_name asc and desc."""
    client.post("/api/v1/assets", json={"asset_name": "AAA Workstation", "location": "Lab 1", "serial_number": "SN-A"})
    client.post("/api/v1/assets", json={"asset_name": "ZZZ Workstation", "location": "Lab 1", "serial_number": "SN-Z"})

    resp_asc = client.get("/api/v1/assets?sort_by=asset_name&sort_order=asc")
    assert resp_asc.status_code == 200
    items_asc = resp_asc.json()["items"]
    assert items_asc[0]["asset_name"] <= items_asc[-1]["asset_name"]


def test_invalid_asset_type_validation(client):
    """Tests validation error for invalid asset_type (HTTP 422)."""
    resp = client.post("/api/v1/assets", json={
        "asset_name": "Supercomputer",
        "asset_type": "QuantumRig",
        "location": "Lab"
    })
    assert resp.status_code == 422


def test_invalid_asset_status_validation(client):
    """Tests validation error for invalid status (HTTP 422)."""
    resp = client.post("/api/v1/assets", json={
        "asset_name": "Standard PC",
        "status": "Destroyed",
        "location": "Lab"
    })
    assert resp.status_code == 422