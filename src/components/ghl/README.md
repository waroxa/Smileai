# SmileVisionPro - GoHighLevel Marketplace App

## Overview

**SmileVisionPro** is a dental transformation suite designed for the GoHighLevel Marketplace. It provides a clinic-neutral, modular UI that can be customized by any dental practice.

## Design Principles

### 1. **Clinic-Neutral by Default**
- No hardcoded clinic branding
- Neutral color scheme (Sky Blue `#0ea5e9` and Purple `#8b5cf6`)
- Generic placeholder content
- Customizable through Settings

### 2. **Clean Medical SaaS Aesthetic**
- White backgrounds with soft gray sections (`bg-gray-50`)
- Minimalist card-based design
- Clear typography hierarchy
- Professional spacing and shadows

### 3. **Modular Components**
All shared components are in `/components/ghl/shared/`:
- `MetricCard.tsx` - Dashboard metrics with icons
- `DataTable.tsx` - Reusable table component
- `ChartCard.tsx` - Chart visualization cards
- `PatientCard.tsx` - Patient information cards

### 4. **Multi-Clinic Ready**
- Dynamic branding through `ClinicBranding` interface
- Color theming throughout
- Logo upload capability
- Clinic name customization
- **Per Sub-Account Branding** - Each GHL sub-account can have unique branding

## File Structure

```
/components/ghl/
├── SmileVisionProApp.tsx      # Main app shell
├── AppHeader.tsx              # Top header with branding
├── AppNavigation.tsx          # Left sidebar navigation
├── DashboardView.tsx          # Dashboard with metrics
├── PatientsView.tsx           # Patient management
├── SmileToolView.tsx          # AI smile transformation tool
├── SettingsView.tsx           # Branding & settings
├── shared/
│   ├── MetricCard.tsx         # Metric display cards
│   ├── DataTable.tsx          # Table component
│   ├── ChartCard.tsx          # Chart display
│   └── PatientCard.tsx        # Patient card
└── README.md                  # This file
```

## How to Access

### Method 1: URL Parameter
Add `?ghl=true` to your URL:
```
https://yourapp.com?ghl=true
```

### Method 2: Path-based
Navigate to:
```
https://yourapp.com/ghl-app
```

### Method 3: Mode Switcher
Click the floating button in the bottom-right corner to toggle between:
- 🌐 Landing Page Mode
- 🏥 GHL App Mode

## Customization

### Changing Clinic Branding

1. Navigate to **Settings** tab
2. Update:
   - Clinic Name
   - Logo (upload)
   - Primary Color (main brand color)
   - Accent Color (secondary color)
3. Click **Save Changes**

All components will automatically update with the new branding.

### Brand Customization Panel Features

**Comprehensive Logo Upload:**
- Drag & drop or click to upload
- Supports PNG, JPG, SVG formats
- Maximum file size: 2MB
- Automatic validation and error messages
- Live preview of uploaded logo

**Quick Color Themes:**
- 8 pre-built color palettes
- One-click theme application
- Visual indication of active theme
- Themes include: Ocean Blue, Medical Teal, Trust Blue, Fresh Green, Warm Orange, Professional Purple, Elegant Rose, Deep Navy

**Custom Color Pickers:**
- Visual color picker for easy selection
- Manual hex code input
- Real-time color preview
- Primary color for buttons and navigation
- Accent color for secondary elements

**Live Preview:**
- Instant updates as you make changes
- Mini app preview showing actual UI
- Color swatch display with hex codes
- Unsaved changes indicator

**Non-Technical UI:**
- Simple language, no technical jargon
- Clear instructions and guidelines
- Visual feedback for all actions
- Tooltips and help text throughout

## Key Features

### 1. Dashboard
- Key metrics (patients, assessments, conversions)
- Interactive charts
- Recent activity table
- Quick stats in sidebar

### 2. Patients
- Patient database
- Search & filter functionality
- Patient cards with status badges
- Quick actions (View, Message)

### 3. Smile Tool
- AI smile transformation interface
- Before/after preview
- File upload (drag & drop)
- Save to patient records

### 4. Settings
- Branding customization
- Notification preferences
- GoHighLevel integration settings
- Billing management

## Color System

### Default Colors
```css
Primary: #0ea5e9 (Sky Blue)
Accent: #8b5cf6 (Purple)
```

### Neutral Palette
```css
White: #ffffff
Gray 50: #f9fafb
Gray 100: #f3f4f6
Gray 200: #e5e7eb
Gray 600: #4b5563
Gray 900: #111827
```

### Status Colors
```css
Success: #10b981 (Green)
Warning: #f59e0b (Yellow)
Error: #ef4444 (Red)
Info: #3b82f6 (Blue)
```

## Component Usage

### MetricCard Example
```tsx
<MetricCard
  title="Total Patients"
  value="142"
  change="+12.5%"
  trend="up"
  icon={Users}
  primaryColor={clinicBranding.primaryColor}
/>
```

### DataTable Example
```tsx
<DataTable
  columns={['Patient', 'Service', 'Date', 'Status']}
  rows={[
    ['John Doe', 'Assessment', '2 days ago', <StatusBadge />],
    ['Jane Smith', 'Consultation', '1 week ago', <StatusBadge />],
  ]}
/>
```

### PatientCard Example
```tsx
<PatientCard
  patient={{
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '(555) 123-4567',
    lastVisit: '2 days ago',
    status: 'Active',
    assessmentCompleted: true,
    consultationScheduled: true,
    avatar: null,
  }}
  primaryColor={clinicBranding.primaryColor}
/>
```

## Integration with GoHighLevel

### Auto-Sync Features
- Contacts sync automatically
- Pipeline integration
- Opportunity creation
- Custom field mapping

### Configuration
Set up in **Settings > Integration** tab:
- Enable auto-sync
- Select default pipeline
- Configure sync preferences

## Best Practices

1. **Keep it Neutral**: Don't add clinic-specific content in core components
2. **Use Theme Colors**: Always use `clinicBranding.primaryColor` for branded elements
3. **Maintain Modularity**: Keep shared components in `/shared/` folder
4. **Test Multi-Brand**: Test with different color schemes to ensure flexibility
5. **Mobile Responsive**: All components use responsive Tailwind classes

## Future Enhancements

- [ ] Dark mode support
- [ ] Custom font selection
- [ ] Advanced chart customization
- [ ] Export functionality
- [ ] Real-time notifications
- [ ] Multi-language support

## Support

For questions or issues with the GHL app:
1. Check this README
2. Review component documentation
3. Test with different branding configurations