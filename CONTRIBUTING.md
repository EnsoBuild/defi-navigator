# Contributing to Enso DeFi Navigator

We welcome contributions to the Enso DeFi Navigator! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Basic understanding of SvelteKit and TypeScript

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/defi-navigator.git
   cd defi-navigator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming Convention

Use the following prefix conventions for your branches:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

Examples:

- `feature/token-comparison`
- `fix/filter-dropdown-overflow`
- `docs/api-integration-guide`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Example:

```
feat(filters): add TVL range filter support

- Add TVL range input component
- Implement range validation
- Update filter service to handle TVL ranges
```

### Code Style

1. **TypeScript**: Use strict TypeScript settings
2. **ESLint**: Follow the project's ESLint configuration
3. **Prettier**: Use Prettier for code formatting
4. **Component Structure**: Follow the established component organization in `lib/components/`

### Testing

Currently, the project doesn't have a formal testing setup, but you're encouraged to:

1. Test your changes thoroughly in different browsers
2. Verify mobile responsiveness
3. Test with different API responses and edge cases

## Making Changes

### Adding New Features

1. Create a new branch from `main`
2. Implement your feature following the existing patterns
3. Test your feature thoroughly
4. Update documentation if needed
5. Create a pull request

### Fixing Bugs

1. Create a branch named `fix/issue-description`
2. Reproduce the bug first
3. Fix the issue
4. Verify the fix doesn't break other functionality
5. Create a pull request

### Updating Documentation

1. Documentation lives in the `/docs` folder or README files
2. Use clear, concise language
3. Include code examples where helpful
4. Update relevant sections of README.md if needed

## Pull Request Process

1. **Update Documentation**: Ensure your PR includes any necessary documentation updates
2. **Add Examples**: Include usage examples for new features
3. **Test Coverage**: Describe how you tested your changes
4. **Description**: Provide a clear description of what changes you made and why
5. **Screenshots**: Include screenshots for UI changes
6. **Link Issues**: Reference any related issues with "Fixes #123"

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing

How has this been tested? Please describe the tests you ran.

## Screenshots (if applicable)

Add screenshots for UI changes

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

## Project Structure

When adding new components or features:

1. **Components**: Add to `lib/components/` following existing categories
2. **Stores**: Place state management in `lib/stores/`
3. **Services**: Add API or business logic to `lib/services/`
4. **Types**: Define TypeScript types in `lib/types/`
5. **Utils**: Helper functions go in `lib/utils/`

## API Integration

When working with the Enso API:

1. Follow the existing patterns in `lib/services/api/`
2. Handle errors appropriately
3. Use TypeScript types for API responses
4. Implement proper loading states

## Design System

The project uses a custom Tailwind theme:

1. Use existing utility classes when possible
2. For custom styles, add to `app.css`
3. Follow the color scheme defined in theme variables
4. Ensure dark mode compatibility

## Community Guidelines

1. **Be Respectful**: Treat other contributors with respect
2. **Be Patient**: Reviews take time
3. **Be Constructive**: Provide helpful feedback
4. **Be Inclusive**: Welcome newcomers

## Getting Help

- **Discord/Telegram**: Join the Enso community channels
- **GitHub Issues**: Search existing issues before creating new ones
- **Documentation**: Check the project README and API docs

## License

By contributing to Enso DeFi Navigator, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🚀
