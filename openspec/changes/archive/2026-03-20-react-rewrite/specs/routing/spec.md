## ADDED Requirements

### Requirement: Navigation page route
The system SHALL serve the navigation page at the root URL path.

#### Scenario: Root path shows navigation page
- **WHEN** user navigates to "/"
- **THEN** navigation page component is rendered
- **AND** page title is "我的网站导航"

### Requirement: Management page route
The system SHALL serve the management page at the "/manage" path.

#### Scenario: Manage path shows management page
- **WHEN** user navigates to "/manage"
- **THEN** management page component is rendered
- **AND** page title is "导航管理"

### Requirement: 404 handling
The system SHALL redirect unknown paths to the navigation page.

#### Scenario: Unknown path redirects
- **WHEN** user navigates to undefined route
- **THEN** user is redirected to "/"
- **AND** navigation page is displayed

### Requirement: Programmatic navigation
The system SHALL provide navigation utilities for routing between pages.

#### Scenario: navigate() function works
- **WHEN** component calls navigate("/manage")
- **THEN** route changes to "/manage"
- **AND** management page renders

#### Scenario: Link component works
- **WHEN** user clicks Link component
- **THEN** navigation occurs without full page reload
- **AND** browser history is updated

### Requirement: Browser history integration
The system SHALL properly integrate with browser back/forward buttons.

#### Scenario: Back button works
- **WHEN** user clicks browser back button
- **THEN** previous route is displayed
- **AND** page state is preserved

### Requirement: Route-based code splitting
The system SHALL lazy load page components for optimal bundle size.

#### Scenario: Management page is lazy loaded
- **WHEN** user navigates to "/manage"
- **THEN** management chunk is loaded on demand
- **AND** initial bundle size is reduced
