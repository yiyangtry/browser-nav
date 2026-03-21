## ADDED Requirements

### Requirement: Add new site form
The system SHALL provide a form to add new sites with name, URL, and category.

#### Scenario: Valid site is added
- **WHEN** user fills form with valid data and submits
- **THEN** site is added to the beginning of the list
- **AND** form resets
- **AND** success message is displayed

#### Scenario: Invalid URL is rejected
- **WHEN** user submits with invalid URL
- **THEN** error message is displayed
- **AND** site is not added

#### Scenario: Missing required fields
- **WHEN** user submits with empty name or URL
- **THEN** error message is displayed
- **AND** site is not added

### Requirement: Edit site functionality
The system SHALL allow users to edit existing sites via a modal dialog.

#### Scenario: Edit modal opens
- **WHEN** user clicks "编辑" on a site
- **THEN** modal opens with current site data
- **AND** focus is on name input

#### Scenario: Site is updated
- **WHEN** user modifies data and saves
- **THEN** site is updated
- **AND** modal closes
- **AND** list refreshes

#### Scenario: Modal is cancelled
- **WHEN** user clicks "取消" or presses Escape
- **THEN** modal closes
- **AND** no changes are saved

### Requirement: Delete site functionality
The system SHALL allow users to delete sites with confirmation.

#### Scenario: Site is deleted after confirmation
- **WHEN** user clicks "删除" and confirms
- **THEN** site is removed from list
- **AND** data is persisted

#### Scenario: Delete is cancelled
- **WHEN** user clicks "删除" but cancels confirmation
- **THEN** site remains in list

### Requirement: Group management
The system SHALL allow users to create, rename, and delete groups.

#### Scenario: New group is created
- **WHEN** user enters new group name and submits
- **THEN** group is added to list
- **AND** form resets
- **AND** success message is displayed

#### Scenario: Duplicate group is rejected
- **WHEN** user tries to create existing group
- **THEN** error message is displayed

#### Scenario: Group is renamed
- **WHEN** user renames a group
- **THEN** all sites in that category are updated
- **AND** group name changes throughout app

#### Scenario: Group is deleted
- **WHEN** user deletes a group
- **THEN** group is removed
- **AND** sites move to "未分组"

### Requirement: Site drag and drop reordering
The system SHALL allow users to reorder sites within a group via drag and drop.

#### Scenario: Site is reordered
- **WHEN** user drags a site and drops on another position
- **THEN** sites reorder within the same group
- **AND** new order is persisted

#### Scenario: Cross-group drop is prevented
- **WHEN** user drags a site to different group
- **THEN** drop is rejected
- **AND** site remains in original group

### Requirement: Category change in place
The system SHALL allow changing a site's category via inline select dropdown.

#### Scenario: Site category is changed
- **WHEN** user selects different category from dropdown
- **THEN** site moves to new group
- **AND** display updates immediately

### Requirement: Restore default data
The system SHALL provide a button to restore default sites and groups.

#### Scenario: Defaults are restored after confirmation
- **WHEN** user clicks "恢复默认" and confirms
- **THEN** default sites and groups are restored
- **AND** success message is displayed

### Requirement: Link to navigation page
The system SHALL provide a link to return to the main navigation page.

#### Scenario: Link returns to navigation
- **WHEN** user clicks "返回导航页"
- **THEN** navigation occurs to home route
