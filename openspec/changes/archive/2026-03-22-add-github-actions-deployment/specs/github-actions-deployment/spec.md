# GitHub Actions Deployment

This specification defines the automated deployment capability for deploying the browser-nav application to GitHub Pages using GitHub Actions.

## ADDED Requirements

### Requirement: Automatic deployment on push
The system SHALL automatically deploy the application to GitHub Pages when code is pushed to the main branch.

#### Scenario: Push to main branch triggers deployment
- **WHEN** code is pushed to the main branch
- **THEN** GitHub Actions workflow is triggered
- **AND** the application is built
- **AND** the built artifacts are deployed to GitHub Pages

### Requirement: Manual deployment trigger
The system SHALL support manual deployment triggers through GitHub Actions workflow dispatch.

#### Scenario: Manual workflow dispatch
- **WHEN** user manually triggers the workflow from GitHub Actions UI
- **THEN** the deployment process executes
- **AND** the application is built and deployed

### Requirement: Build process
The system SHALL build the React + Vite application using TypeScript compilation before deployment.

#### Scenario: Successful build
- **WHEN** the build process runs
- **THEN** TypeScript compilation executes
- **AND** Vite build process creates production assets in ./dist directory
- **AND** build fails if TypeScript errors are present

### Requirement: Artifact upload
The system SHALL upload the built artifacts as GitHub Pages deployment artifacts.

#### Scenario: Upload dist directory
- **WHEN** build completes successfully
- **THEN** the ./dist directory is uploaded as a Pages artifact
- **AND** artifact is available for deployment step

### Requirement: Deployment permissions
The system SHALL require specific GitHub Actions permissions for Pages deployment.

#### Scenario: Required permissions
- **WHEN** workflow is configured
- **THEN** contents: read permission is granted
- **AND** pages: write permission is granted
- **AND** id-token: write permission is granted

### Requirement: Deployment environment
The system SHALL deploy to the github-pages environment with URL information.

#### Scenario: Deployment output
- **WHEN** deployment completes
- **THEN** deployment URL is available in workflow output
- **AND** environment is marked as github-pages

### Requirement: Concurrency control
The system SHALL prevent concurrent deployments to avoid conflicts.

#### Scenario: Concurrent push handling
- **WHEN** multiple deployments are triggered
- **THEN** only one deployment runs at a time
- **AND** in-progress deployments are not cancelled
- **AND** deployments are grouped under "pages" concurrency group

### Requirement: Node.js environment
The system SHALL use Node.js version 20 or later for the build process.

#### Scenario: Setup Node.js
- **WHEN** build job starts
- **THEN** Node.js is installed
- **AND** npm cache is configured for dependency caching

### Requirement: Dependency installation
The system SHALL install project dependencies using npm ci before building.

#### Scenario: Install dependencies
- **WHEN** Node.js is set up
- **THEN** npm ci installs dependencies from package-lock.json
- **AND** install process uses cached dependencies when available
