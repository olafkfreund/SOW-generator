# TODO: Google Calendar Integration

## 📅 Objective

Integrate Google Calendar with the SOW Template Service engineer calendar to automatically check engineer availability when generating project timelines and resource allocations.

## 🎯 Implementation Plan

### 1. Google Cloud Setup

- [ ] Set up Google Cloud Console project
- [ ] Enable Google Calendar API
- [ ] Create OAuth 2.0 credentials
- [ ] Configure redirect URI: `http://localhost:4000/auth/google/callback`

### 2. Backend Dependencies

- [ ] Install Google APIs client libraries:

```bash
npm install googleapis @google-cloud/local-auth google-auth-library
npm install --save-dev @types/google-auth-library
```

### 3. Environment Configuration

- [ ] Add Google credentials to environment variables:

```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
GOOGLE_CALENDAR_SCOPES=https://www.googleapis.com/auth/calendar.readonly
```

### 4. Backend Implementation

- [ ] Create `GoogleCalendarService` class in `backend/src/services/googleCalendarService.ts`
  - [ ] OAuth2 authentication flow
  - [ ] Token management (save/load from file)
  - [ ] Engineer availability checking
  - [ ] Time-off event filtering
  - [ ] Multi-engineer availability aggregation

- [ ] Create authentication routes in `backend/src/routes/auth.ts`
  - [ ] `GET /api/auth/google` - Initiate OAuth flow
  - [ ] `GET /api/auth/google/callback` - Handle OAuth callback
  - [ ] `GET /api/auth/status` - Check authentication status

- [ ] Enhance calendar routes in `backend/src/routes/calendar.ts`
  - [ ] Integrate Google Calendar data with local calendar
  - [ ] `POST /api/calendar/check-availability` - Check engineer availability
  - [ ] `POST /api/calendar/sync` - Sync Google Calendar data

### 5. Frontend Implementation

- [ ] Create `GoogleCalendarIntegration` component
  - [ ] Authentication status display
  - [ ] OAuth flow initiation
  - [ ] Calendar sync functionality
  - [ ] Integration status indicators

- [ ] Update `ManagementDashboard` to include Google Calendar integration
- [ ] Add calendar integration styles to match Gruvbox theme

### 6. Data Integration

- [ ] Update engineer profiles to include email addresses
- [ ] Implement time-off keyword detection:
  - vacation, pto, time off, holiday, sick, leave
- [ ] Create availability checking logic for project planning

### 7. SOW Generation Enhancement

- [ ] Integrate availability checking into SOW generation process
- [ ] Automatically suggest available engineers for projects
- [ ] Include availability conflicts in risk assessment
- [ ] Generate realistic project timelines based on team availability

### 8. Testing

- [ ] Unit tests for GoogleCalendarService
- [ ] Integration tests for auth flow
- [ ] Frontend tests for calendar integration component
- [ ] End-to-end tests for availability checking

### 9. Documentation

- [ ] Update README with Google Calendar setup instructions
- [ ] Document API endpoints for calendar integration
- [ ] Add troubleshooting guide for common OAuth issues
- [ ] Update Copilot instructions with calendar integration patterns

### 10. Deployment

- [ ] Update Docker containers with Google Calendar dependencies
- [ ] Add Kubernetes secrets for Google credentials
- [ ] Update environment configuration for production deployment

## 🔧 Technical Details

### Key Classes & Interfaces

```typescript
interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  attendees?: Array<{ email: string; displayName?: string }>;
  description?: string;
}

interface EngineerCalendarData {
  engineerEmail: string;
  events: CalendarEvent[];
  timeOff: Array<{
    start: string;
    end: string;
    title: string;
  }>;
}

class GoogleCalendarService {
  // OAuth2 authentication
  // Token management
  // Calendar data retrieval
  // Availability checking
}
```

### API Endpoints

- `GET /api/auth/google` - Initiate OAuth flow
- `GET /api/auth/google/callback` - OAuth callback handler
- `GET /api/auth/status` - Check authentication status
- `GET /api/calendar` - Get enhanced calendar data (local + Google)
- `POST /api/calendar/check-availability` - Check engineer availability
- `POST /api/calendar/sync` - Sync Google Calendar data

### Security Considerations

- [ ] Store OAuth tokens securely
- [ ] Implement token refresh logic
- [ ] Validate calendar access permissions
- [ ] Handle authentication errors gracefully
- [ ] Implement rate limiting for Google API calls

## ⚡ Quick Start Commands

```bash
# Install dependencies
just install-google-calendar

# Test authentication status
just test-calendar-auth

# Sync calendar data
just sync-calendar
```

## 🎯 Success Criteria

- [ ] Engineers can authenticate with Google Calendar
- [ ] System automatically detects time-off from calendar events
- [ ] SOW generation includes realistic availability-based timelines
- [ ] Management dashboard shows real-time availability status
- [ ] Integration works seamlessly with existing SOW workflow

## 📋 Dependencies

- googleapis
- @google-cloud/local-auth
- google-auth-library
- @types/google-auth-library

## 🔗 Related Files

- `backend/src/services/googleCalendarService.ts` (new)
- `backend/src/routes/auth.ts` (new)
- `backend/src/routes/calendar.ts` (enhance)
- `frontend/src/components/GoogleCalendarIntegration.tsx` (new)
- `backend/content/engineers.md` (update with emails)

## 📝 Notes

- Requires Google Cloud Console setup and OAuth credentials
- Engineers must grant calendar access permissions
- Time-off detection based on event title keywords
- Integration enhances SOW accuracy with real availability data
- Supports both individual and team availability checking

---

**Priority**: Medium  
**Estimated Effort**: 2-3 days  
**Dependencies**: Google Calendar API access, Engineer email addresses