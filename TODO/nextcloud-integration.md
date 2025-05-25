# TODO: Nextcloud Integration

## 📅 Objective

Integrate Nextcloud with the SOW Template Service to provide self-hosted cloud storage, calendar synchronization, file collaboration, and team coordination for organizations preferring open-source solutions and data sovereignty.

## 🎯 Implementation Plan

### 1. Nextcloud Instance Setup

- [ ] Configure Nextcloud server connection
- [ ] Set up App Password authentication
- [ ] Enable required Nextcloud apps (Calendar, Files, Contacts, Talk)
- [ ] Configure WebDAV and CalDAV endpoints
- [ ] Set up API access permissions

### 2. Backend Dependencies

- [ ] Install Nextcloud and WebDAV client libraries:

```bash
npm install webdav-client caldav-client
npm install node-fetch form-data
npm install xml2js ical.js
npm install --save-dev @types/xml2js @types/ical.js
```

### 3. Environment Configuration

- [ ] Add Nextcloud credentials to environment variables:

```bash
NEXTCLOUD_URL=https://your-nextcloud-instance.com
NEXTCLOUD_USERNAME=sow_service_user
NEXTCLOUD_APP_PASSWORD=your_app_password
NEXTCLOUD_WEBDAV_PATH=/remote.php/dav/files/
NEXTCLOUD_CALDAV_PATH=/remote.php/dav/calendars/
NEXTCLOUD_CARDDAV_PATH=/remote.php/dav/addressbooks/
```

### 4. Backend Implementation

- [ ] Create `NextcloudService` class in `backend/src/services/nextcloudService.ts`
  - [ ] WebDAV client initialization
  - [ ] CalDAV calendar integration
  - [ ] CardDAV contacts integration
  - [ ] File upload/download operations
  - [ ] Folder management and permissions
  - [ ] Share link generation

- [ ] Create Nextcloud authentication routes in `backend/src/routes/auth.ts`
  - [ ] `POST /api/auth/nextcloud` - Configure Nextcloud connection
  - [ ] `GET /api/auth/nextcloud/status` - Check connection status
  - [ ] `POST /api/auth/nextcloud/test` - Test server connectivity
  - [ ] `DELETE /api/auth/nextcloud` - Remove Nextcloud configuration

- [ ] Enhance calendar routes for Nextcloud integration
  - [ ] Integrate CalDAV calendar data
  - [ ] Support multiple calendar collections
  - [ ] Handle timezone conversions
  - [ ] Sync recurring events and tasks

### 5. Frontend Implementation

- [ ] Create `NextcloudIntegration` component
  - [ ] Server configuration interface
  - [ ] Connection status display
  - [ ] Calendar and file sync functionality
  - [ ] File browser for Nextcloud storage
  - [ ] Share management interface

- [ ] Update `ManagementDashboard` to include Nextcloud integration
- [ ] Add Nextcloud-themed styling consistent with Gruvbox theme
- [ ] Implement file picker for Nextcloud documents
- [ ] Create folder structure management interface

### 6. WebDAV File Integration

- [ ] Implement file operations
  - [ ] Upload generated SOWs to Nextcloud
  - [ ] Download project documents from Nextcloud
  - [ ] Create project folders automatically
  - [ ] Manage file versions and history
  - [ ] Generate public share links

- [ ] Implement folder structure
  - [ ] Auto-create SOW project folders
  - [ ] Organize files by client/project
  - [ ] Set appropriate permissions
  - [ ] Handle folder sharing

### 7. CalDAV Calendar Integration

- [ ] Implement calendar synchronization
  - [ ] Fetch engineer calendars from Nextcloud
  - [ ] Parse CalDAV events and availability
  - [ ] Handle recurring events properly
  - [ ] Support multiple calendar collections
  - [ ] Sync task lists and todos

- [ ] Implement calendar operations
  - [ ] Create project milestone events
  - [ ] Schedule team meetings
  - [ ] Set project deadlines
  - [ ] Handle calendar sharing

### 8. CardDAV Contacts Integration

- [ ] Implement contact management
  - [ ] Sync engineer contact information
  - [ ] Manage client contact details
  - [ ] Create contact groups for projects
  - [ ] Handle contact sharing

### 9. Advanced Features

- [ ] Nextcloud Talk integration for team communication
- [ ] Nextcloud Deck integration for project management
- [ ] Nextcloud Notes integration for project documentation
- [ ] Nextcloud Forms integration for client requirements
- [ ] Activity feed integration for project tracking

### 10. SOW Generation Enhancement

- [ ] Auto-save SOWs to dedicated Nextcloud folders
- [ ] Create project workspaces in Nextcloud
- [ ] Generate share links for client SOW reviews
- [ ] Version control for SOW iterations
- [ ] Collaborative editing through Nextcloud Office

### 11. Testing

- [ ] Unit tests for NextcloudService
- [ ] Integration tests for WebDAV operations
- [ ] CalDAV calendar sync testing
- [ ] File upload/download testing
- [ ] Share link generation testing
- [ ] Frontend tests for Nextcloud components

### 12. Documentation

- [ ] Update README with Nextcloud setup instructions
- [ ] Document WebDAV/CalDAV configuration
- [ ] Create Nextcloud app installation guide
- [ ] Add troubleshooting for connection issues
- [ ] Document folder structure and permissions

### 13. Deployment

- [ ] Update Docker containers with WebDAV dependencies
- [ ] Add Kubernetes secrets for Nextcloud credentials
- [ ] Configure SSL/TLS for secure connections
- [ ] Set up automated backup strategies

## 🔧 Technical Details

### Key Classes & Interfaces

```typescript
interface NextcloudEvent {
  uid: string;
  summary: string;
  dtstart: { value: Date; timezone?: string };
  dtend: { value: Date; timezone?: string };
  description?: string;
  location?: string;
  attendees?: Array<{ cn: string; email: string }>;
  rrule?: string;
}

interface NextcloudFile {
  basename: string;
  filename: string;
  lastmod: string;
  size: number;
  type: 'file' | 'directory';
  etag: string;
  mime?: string;
}

interface NextcloudContact {
  uid: string;
  fn: string; // Full name
  email: string[];
  tel?: string[];
  org?: string;
  title?: string;
  note?: string;
}

interface NextcloudShare {
  id: string;
  url: string;
  token: string;
  permissions: number;
  expiration?: string;
  password?: boolean;
}

class NextcloudService {
  // WebDAV client
  // CalDAV operations
  // CardDAV operations
  // File management
  // Share management
}
```

### API Endpoints

- `POST /api/auth/nextcloud` - Configure Nextcloud connection
- `GET /api/auth/nextcloud/status` - Check connection status
- `POST /api/auth/nextcloud/test` - Test server connectivity
- `GET /api/calendar/nextcloud` - Get CalDAV calendar data
- `GET /api/files/nextcloud` - List Nextcloud files and folders
- `POST /api/files/nextcloud/upload` - Upload files to Nextcloud
- `POST /api/files/nextcloud/share` - Create share links
- `GET /api/contacts/nextcloud` - Get CardDAV contacts
- `POST /api/projects/nextcloud/workspace` - Create project workspace

### Security Considerations

- [ ] Use App Passwords instead of main account passwords
- [ ] Implement SSL/TLS verification for server connections
- [ ] Validate server certificates
- [ ] Secure storage of connection credentials
- [ ] Handle authentication errors gracefully
- [ ] Implement proper session management
- [ ] Respect Nextcloud rate limiting

## ⚡ Quick Start Commands

```bash
# Install Nextcloud dependencies
just install-nextcloud

# Test Nextcloud connection
just test-nextcloud-connection

# Sync CalDAV calendars
just sync-nextcloud-calendars

# Upload test SOW to Nextcloud
just test-nextcloud-upload

# Test WebDAV file operations
just test-nextcloud-webdav
```

## 🎯 Success Criteria

- [ ] Successfully connect to Nextcloud instance
- [ ] Sync engineer calendars from CalDAV
- [ ] Upload and organize SOW documents in Nextcloud
- [ ] Generate secure share links for client access
- [ ] Create automated project workspaces
- [ ] Integrate contact management through CardDAV
- [ ] Support collaborative document editing

## 📋 Dependencies

- webdav-client
- caldav-client
- node-fetch
- form-data
- xml2js
- ical.js
- @types/xml2js
- @types/ical.js

## 🔗 Related Files

- `backend/src/services/nextcloudService.ts` (new)
- `backend/src/routes/auth.ts` (enhance)
- `backend/src/routes/calendar.ts` (enhance)
- `backend/src/routes/files.ts` (new)
- `backend/src/routes/contacts.ts` (new)
- `frontend/src/components/NextcloudIntegration.tsx` (new)
- `frontend/src/components/NextcloudFileBrowser.tsx` (new)
- `backend/content/engineers.md` (update with Nextcloud usernames)

## 📝 Notes

- Requires self-hosted or managed Nextcloud instance
- Supports both on-premises and cloud-hosted Nextcloud
- App Passwords provide secure API access without main credentials
- WebDAV enables seamless file synchronization
- CalDAV provides standards-based calendar integration
- CardDAV enables contact management
- Excellent choice for organizations requiring data sovereignty
- Open-source solution with extensive customization options
- Supports collaborative editing through Nextcloud Office/OnlyOffice

## 🌐 Nextcloud Apps Required

- **Files** - Basic file storage and sharing
- **Calendar** - CalDAV calendar functionality
- **Contacts** - CardDAV contact management
- **Activity** - Track file and calendar changes
- **Talk** - Team communication (optional)
- **Deck** - Project management (optional)
- **Notes** - Documentation (optional)
- **Forms** - Client requirements gathering (optional)
- **Nextcloud Office** - Collaborative document editing (optional)

## 🔐 Nextcloud Permissions Configuration

- [ ] Create dedicated service user account
- [ ] Generate App Password for API access
- [ ] Configure appropriate folder permissions
- [ ] Set up calendar sharing permissions
- [ ] Configure contact access permissions
- [ ] Enable external sharing if required

---

**Priority**: Medium  
**Estimated Effort**: 2-3 days  
**Dependencies**: Nextcloud instance access, App Password, WebDAV/CalDAV enabled