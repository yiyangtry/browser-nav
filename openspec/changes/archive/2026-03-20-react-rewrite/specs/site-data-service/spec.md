## ADDED Requirements

### Requirement: Site data persistence with localStorage
The system SHALL persist site data to localStorage using the existing storage key format.

#### Scenario: Sites are saved to localStorage
- **WHEN** site data changes
- **THEN** system saves to localStorage with key "my-nav-sites-v1"
- **AND** data format remains compatible with existing implementation

#### Scenario: Sites are loaded from localStorage
- **WHEN** application initializes
- **THEN** system loads sites from localStorage
- **AND** returns default sites if no saved data exists

### Requirement: Group data persistence
The system SHALL persist group data to localStorage separately from site data.

#### Scenario: Groups are saved to localStorage
- **WHEN** group data changes
- **THEN** system saves to localStorage with key "my-nav-groups-v1"
- **AND** data format remains compatible with existing implementation

### Requirement: React hooks for data access
The system SHALL provide React hooks for accessing and mutating site and group data.

#### Scenario: useSites hook returns sites and mutators
- **WHEN** component calls useSites()
- **THEN** hook returns sites array and CRUD operations
- **AND** changes trigger re-renders

#### Scenario: useGroups hook returns groups and mutators
- **WHEN** component calls useGroups()
- **THEN** hook returns groups array and CRUD operations
- **AND** changes trigger re-renders

### Requirement: Data normalization and validation
The system SHALL normalize and validate all data before saving.

#### Scenario: Site URL normalization
- **WHEN** site is saved with missing protocol
- **THEN** system prepends "https://"
- **AND** validates URL format

#### Scenario: Category normalization
- **WHEN** site is saved with empty category
- **THEN** system defaults to "未分组"

### Requirement: Default data merging
The system SHALL merge default sites when loading if saved data is missing them.

#### Scenario: Default sites added on first load
- **WHEN** application loads with empty localStorage
- **THEN** system initializes with default sites
- **AND** default groups are created

### Requirement: Group synchronization
The system SHALL synchronize groups with sites to ensure all site categories exist as groups.

#### Scenario: Groups sync with site categories
- **WHEN** site is added with new category
- **THEN** system automatically adds category to groups list
- **AND** when category is deleted, sites move to "未分组"
