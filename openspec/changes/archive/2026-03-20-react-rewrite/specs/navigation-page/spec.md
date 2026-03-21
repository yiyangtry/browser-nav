## ADDED Requirements

### Requirement: Site list display with grouping
The system SHALL display all sites grouped by category in a responsive grid layout.

#### Scenario: Sites are grouped by category
- **WHEN** navigation page loads
- **THEN** sites are grouped by category
- **AND** each group shows category name and count

#### Scenario: Empty state is shown
- **WHEN** no sites exist
- **THEN** system displays "还没有网址，请先去管理页添加。"

### Requirement: Search functionality
The system SHALL provide real-time search filtering by site name and URL.

#### Scenario: Search filters sites
- **WHEN** user types in search box
- **THEN** list filters to show matching sites
- **AND** matching text is highlighted

#### Scenario: No results message
- **WHEN** search returns no results
- **THEN** system displays "未找到匹配的网站"

#### Scenario: Keyboard shortcut for search
- **WHEN** user presses "/" key when not in input
- **THEN** search input receives focus

### Requirement: Site card interaction
The system SHALL allow users to open sites by clicking on site cards.

#### Scenario: Click opens site in new tab
- **WHEN** user clicks on site card
- **THEN** site opens in new tab/window
- **AND** opener reference is removed for security

#### Scenario: Keyboard navigation
- **WHEN** user focuses site card and presses Enter/Space
- **THEN** site opens in new tab/window

### Requirement: Refresh functionality
The system SHALL provide a button to reload site data from storage.

#### Scenario: Refresh reloads data
- **WHEN** user clicks "刷新数据"
- **THEN** system reloads sites from localStorage
- **AND** display updates with latest data

### Requirement: Management page link
The system SHALL provide a link to navigate to the management page.

#### Scenario: Link opens management page
- **WHEN** user clicks "进入管理页"
- **THEN** navigation occurs to management route
- **AND** page opens in new tab (existing behavior)

### Requirement: Responsive design
The system SHALL display properly on mobile and desktop screen sizes.

#### Scenario: Mobile layout
- **WHEN** viewport width is less than 640px
- **THEN** site grid displays as single column
- **AND** toolbar stacks vertically

#### Scenario: Desktop layout
- **WHEN** viewport width is 640px or greater
- **THEN** site grid displays multiple columns
- **AND** toolbar displays horizontally
