# OwnAI Purchase Order Manager

A modern React application for managing Purchase Orders (POs) in a talent acquisition and staffing management system. The app allows users to create and manage POs for clients, assign jobs and talents, and handle billing details with validation and read-only submission modes.

## Features

### Purchase Order Management
- **Client Selection**: Choose from predefined clients with their associated job requirements
- **PO Types**: Support for both Individual and Group Purchase Orders
- **Comprehensive Details**: Capture PO number, dates, budget, currency, and recipient information
- **Form Validation**: Client-side validation with detailed error messages

### Job and Talent Assignment
- **Dynamic Job Management**: Add/remove jobs associated with specific requirements
- **Talent Pool**: Select from available talents in "moved" stage or add manually
- **Flexible Talent Addition**: Support for requirement-based talents and custom manual entries
- **Billing Configuration**: Set contract duration, bill rates, standard rates, and overtime rates
- **Currency Support**: Multiple currency options (USD, INR) for all financial fields

### User Experience
- **Responsive Design**: Bootstrap-powered responsive layout
- **Intuitive UI**: Modern card-based interface with icons and visual feedback
- **Validation Feedback**: Real-time error display and scroll-to-top on submission errors
- **Read-Only Mode**: Post-submission read-only view for confirmation
- **Reset Functionality**: Easy form reset with confirmation

## Technology Stack

- **Framework**: React 19.2.0 with Hooks (useState, useEffect)
- **Build Tool**: Vite (with Rolldown)
- **Styling**: Bootstrap 5.3.8, Tailwind CSS 4.1.17, Bootstrap Icons
- **Date Handling**: React DatePicker 8.9.0
- **Linting**: ESLint with React hooks and refresh plugins
- **Package Manager**: npm

## Project Structure

```
ownai/
├── public/
│   ├── vite.svg
│   └── (favicon, etc.)
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx          # Main application component
│   ├── App.css          # Component-specific styles
│   ├── index.css        # Global styles
│   ├── main.jsx         # Application entry point
│   └── (other assets)
├── package.json         # Dependencies and scripts
├── vite.config.js       # Build configuration
├── index.html           # HTML template
└── README.md            # This file
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Itsnishant4/ownai-task.git
   cd ownai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Development

### Start the development server
```bash
npm run dev
```
- Opens the app at `http://localhost:5173`
- Hot module replacement enabled for fast development

### Build for production
```bash
npm run build
```
- Creates optimized build in the `dist` folder

### Preview production build
```bash
npm run preview
```
- Serves the built application locally

### Lint the code
```bash
npm run lint
```
- Runs ESLint to check for code quality issues

## Usage

1. **Select a Client**: Choose from the dropdown (e.g., Collabera Inc, Acme Corp)
2. **Choose PO Type**: Select Individual or Group Purchase Order
3. **Enter PO Details**: Fill in the required fields including PO number, dates, budget, and recipient info
4. **Add Jobs**: Click "Add Job" to create job entries associated with client requirements
5. **Assign Talents**: For each job, add talents manually or from the requirement's available pool
6. **Configure Billing**: Set rates, currencies, and contract durations for each talent
7. **Submit**: Validate and submit the form - switches to read-only mode for confirmation

### PO Type Rules
- **Individual PO**: Exactly one talent must be assigned across all jobs
- **Group PO**: At least two talents must be assigned across all jobs

## Development Notes

- The application uses hardcoded client and requirement data for demonstration
- Form state is managed entirely client-side with React hooks
- Bootstrap provides the primary UI framework with Tailwind for additional utilities
- All currency fields support both USD and INR with consistent formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is private and proprietary.

---

*Built with React and Vite for modern web development experience.*
