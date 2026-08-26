from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    TECHNICIAN = "technician"
    USER = "user"


class RequesterType(str, Enum):
    STUDENT = "Student"
    FACULTY = "Faculty"
    STAFF = "Staff"


class TicketCategory(str, Enum):
    NETWORK = "Network"
    COMPUTER_LAB = "Computer/Lab"
    PRINTER = "Printer"
    PROJECTOR = "Projector"
    SOFTWARE = "Software"
    HARDWARE = "Hardware"
    OTHER = "Other"


class TicketPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class TicketStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"


class AssetType(str, Enum):
    DESKTOP = "Desktop"
    LAPTOP = "Laptop"
    PRINTER = "Printer"
    PROJECTOR = "Projector"
    ROUTER = "Router"
    SWITCH = "Switch"
    OTHER = "Other"


class AssetStatus(str, Enum):
    WORKING = "Working"
    UNDER_MAINTENANCE = "Under Maintenance"
    OUT_OF_SERVICE = "Out of Service"