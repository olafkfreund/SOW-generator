# TODO: Office 365 Integration

## 📅 Objective

Integrate Office 365 services (Outlook Calendar, Teams, SharePoint, OneDrive) with the SOW Template Service to provide comprehensive Microsoft ecosystem support for engineer availability, document collaboration, and project management.

## 🎯 Implementation Plan

### 1. Microsoft Azure Setup

- [ ] Set up Azure App Registration
- [ ] Configure Microsoft Graph API permissions
- [ ] Enable Calendar.Read, User.Read, Files.Read permissions
- [ ] Set up redirect URI: `http://localhost:4000/auth/microsoft/callback`
- [ ] Configure multi-tenant or single-tenant application

### 2. Backend Dependencies

- [ ] Install Microsoft Graph and authentication libraries:

```bash
npm install @azure/msal-node @microsoft/microsoft-graph-client
npm install isomorphic-fetch
npm install --save-dev @types/isomorphic-fetch
```

### 3. Environment Configuration

- [ ] Add Microsoft credentials to environment variables:

```bash
MICROSOFT_CLIENT_ID=your_app_client_id
MICROSOFT_CLIENT_SECRET=your_app_client_secret
MICROSOFT_TENANT_ID=your_tenant_id
MICROSOFT_REDIRECT_URI=http://localhost:4000/auth/microsoft/callback
MICROSOFT_GRAPH_SCOPES=https://graph.microsoft.com/calendars.read,https://graph.microsoft.com/user.read
```

### 4. Backend Implementation

- [ ] Create `Office365Service` class in `backend/src/services/office365Service.ts`
  - [ ] MSAL authentication flow
  - [ ] Microsoft Graph client initialization
  - [ ] Outlook Calendar integration
  - [ ] Teams presence status checking
  - [ ] SharePoint document access
  - [ ] OneDrive file management

- [ ] Create Microsoft authentication routes in `backend/src/routes/auth.ts`
  - [ ] `GET /api/auth/microsoft` - Initiate OAuth flow
  - [ ] `GET /api/auth/microsoft/callback` - Handle OAuth callback
  - [ ] `GET /api/auth/microsoft/status` - Check authentication status
  - [ ] `POST /api/auth/microsoft/refresh` - Refresh access token

- [ ] Enhance calendar routes for Office 365 integration
  - [ ] Integrate Outlook Calendar data
  - [ ] Support recurring events and meeting patterns
  - [ ] Handle timezone conversions
  - [ ] Check Teams meeting conflicts

### 5. Frontend Implementation

- [ ] Create `Office365Integration` component
  - [ ] Microsoft authentication status display
  - [ ] OAuth flow initiation with Microsoft identity
  - [ ] Calendar and Teams sync functionality
  - [ ] SharePoint document browser
  - [ ] Integration health monitoring

- [ ] Update `ManagementDashboard` to include Office 365 integration
- [ ] Add Microsoft-themed styling consistent with Gruvbox theme
- [ ] Implement file picker for SharePoint/OneDrive documents

### 6. Microsoft Graph Integration

- [ ] Implement Calendar API integration
  - [ ] Fetch engineer Outlook calendars
  - [ ] Parse meeting invitations and time blocks
  - [ ] Detect out-of-office auto-replies
  - [ ] Handle recurring meeting patterns

- [ ] Implement Teams integration
  - [ ] Check user presence status (Available, Busy, Away, etc.)
  - [ ] Detect active Teams meetings
  - [ ] Integration with Teams calendar

- [ ] Implement SharePoint/OneDrive integration
  - [ ] Access project documents from SharePoint
  - [ ] Upload generated SOWs to OneDrive/SharePoint
  - [ ] Version control and document collaboration

### 7. Advanced Features

- [ ] Teams Bot integration for SOW notifications
- [ ] Outlook add-in for SOW generation
- [ ] SharePoint list integration for project tracking
- [ ] Power Automate workflow triggers
- [ ] Integration with Microsoft Project Online

### 8. SOW Generation Enhancement

- [ ] Include Teams meeting availability in scheduling
- [ ] Auto-save SOWs to SharePoint document libraries
- [ ] Email generated SOWs via Outlook integration
- [ ] Create Teams channels for new projects
- [ ] Schedule project kickoff meetings automatically

### 9. Testing

- [ ] Unit tests for Office365Service
- [ ] Integration tests for Microsoft Graph API calls
- [ ] Frontend tests for Office 365 components
- [ ] End-to-end tests for document collaboration
- [ ] Authentication flow testing with MSAL

### 10. Documentation

- [ ] Update README with Office 365 setup instructions
- [ ] Document Microsoft Graph API usage
- [ ] Create Azure App Registration guide
- [ ] Add troubleshooting for common Microsoft auth issues
- [ ] Document SharePoint permission requirements

### 11. Deployment

- [ ] Update Docker containers with Microsoft Graph dependencies
- [ ] Add Kubernetes secrets for Microsoft credentials
- [ ] Configure production Azure App Registration
- [ ] Set up Microsoft Graph webhooks for real-time updates

## 🔧 Technical Details

### Key Classes & Interfaces

```typescript
interface OutlookEvent {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees: Array<{ emailAddress: { address: string; name: string } }>;
  isOnlineMeeting: boolean;
  onlineMeeting?: {
    joinUrl: string;
    conferenceId: string;
  };
}

interface TeamsPresence {
  id: string;
  availability: 'Available' | 'Busy' | 'Away' | 'BeRightBack' | 'DoNotDisturb' | 'Offline';
  activity: string;
  outOfOfficeSettings?: {
    message: string;
    isOutOfOffice: boolean;
  };
}

interface SharePointDocument {
  id: string;
  name: string;
  webUrl: string;
  lastModifiedDateTime: string;
  createdBy: { user: { displayName: string } };
  size: number;
}

class Office365Service {
  // MSAL authentication
  // Microsoft Graph client
  // Calendar operations
  // Teams integration
  // SharePoint/OneDrive operations
}
```

### API Endpoints

- `GET /api/auth/microsoft` - Initiate Microsoft OAuth flow
- `GET /api/auth/microsoft/callback` - OAuth callback handler
- `GET /api/auth/microsoft/status` - Check authentication status
- `POST /api/auth/microsoft/refresh` - Refresh access token
- `GET /api/calendar/outlook` - Get Outlook calendar data
- `GET /api/teams/presence` - Get Teams presence status
- `GET /api/sharepoint/documents` - List SharePoint documents
- `POST /api/sharepoint/upload` - Upload documents to SharePoint
- `GET /api/onedrive/files` - List OneDrive files

### Security Considerations

- [ ] Implement secure token storage with encryption
- [ ] Handle token refresh automatically
- [ ] Validate Microsoft Graph permissions
- [ ] Implement proper error handling for auth failures
- [ ] Add rate limiting for Microsoft Graph API calls
- [ ] Secure handling of sensitive calendar data
- [ ] Implement proper logout and token revocation

## ⚡ Quick Start Commands

```bash
# Install Office 365 dependencies
just install-office365

# Test Microsoft authentication
just test-microsoft-auth

# Sync Outlook calendar data
just sync-outlook-calendar

# Test Teams integration
just test-teams-presence

# Upload test document to SharePoint
just test-sharepoint-upload
```

## 🎯 Success Criteria

- [ ] Engineers can authenticate with Microsoft accounts
- [ ] System reads Outlook calendar events and availability
- [ ] Teams presence status affects availability calculations
- [ ] Generated SOWs can be saved to SharePoint/OneDrive
- [ ] Integration works with both personal and work Microsoft accounts
- [ ] Real-time presence updates from Teams
- [ ] Seamless document collaboration through SharePoint

## 📋 Dependencies

- @azure/msal-node
- @microsoft/microsoft-graph-client
- isomorphic-fetch
- @types/isomorphic-fetch

## 🔗 Related Files

- `backend/src/services/office365Service.ts` (new)
- `backend/src/routes/auth.ts` (enhance)
- `backend/src/routes/calendar.ts` (enhance)
- `backend/src/routes/sharepoint.ts` (new)
- `frontend/src/components/Office365Integration.tsx` (new)
- `frontend/src/components/SharePointDocumentPicker.tsx` (new)
- `backend/content/engineers.md` (update with Microsoft emails)

## 📝 Notes

- Requires Azure App Registration and tenant configuration
- Supports both personal Microsoft accounts and work/school accounts
- Teams integration requires additional permissions
- SharePoint access depends on organization policies
- OneDrive integration works with both personal and business accounts
- Consider implementing Microsoft Graph webhooks for real-time updates
- Integration enhances collaboration through Microsoft ecosystem

## 🌐 Microsoft Graph Permissions Required

- `Calendars.Read` - Read user calendars
- `User.Read` - Read user profile
- `Presence.Read` - Read Teams presence
- `Files.Read` - Read OneDrive files
- `Sites.Read.All` - Read SharePoint sites (admin consent required)
- `Mail.Send` - Send emails with generated SOWs
- `Team.ReadBasic.All` - Read Teams information

---

**Priority**: High  
**Estimated Effort**: 3-4 days  
**Dependencies**: Azure App Registration, Microsoft Graph API access, Office 365 licenses