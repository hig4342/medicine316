# Commit Message Guidelines

Clear and consistent commit messages are crucial for understanding project history, debugging, and collaboration. Please follow these guidelines when writing your commit messages.

## Commit Message Format

We generally follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, enhanced with [Gitmoji](https://gitmoji.dev/) for quick visual identification. The basic format is:

```
{gitmoji} {type}{scope?}: {description}

{body?}

{breaking_change?}{footer?}
```

## Details

### 1. Gitmoji (Essential)

Start the commit message line with **one** relevant Gitmoji icon that best represents the purpose of the commit.

- Use the Gitmoji code to visually represent the purpose of the commit.
- Refer to the `.agents/gitmoji.json` file to select the appropriate gitmoji for the situation.
- Write the commit message in **code format**. (e.g., `:sparkles:`)

### 2. Type (Essential)

Must be one of the following lowercase types. Each type corresponds to a specific Gitmoji.:

| Type       | Description                                       | Corresponding Gitmoji |
| ---------- | ------------------------------------------------- | --------------------- |
| `feat`     | Add a new feature                                 | `:sparkles:`          |
| `fix`      | Fix a bug                                         | `:bug:`               |
| `docs`     | Add or update documentation                       | `:memo:`              |
| `style`    | Improve code style (formatting, semicolons, etc.) | `:art:`               |
| `refactor` | Refactor code                                     | `:recycle:`           |
| `perf`     | Improve performance                               | `:zap:`               |
| `test`     | Add or update tests                               | `:white_check_mark:`  |
| `chore`    | Build, package management, etc.                   | `:wrench:`            |
| `ci`       | CI/CD configuration changes                       | `:green_heart:`       |
| `move`     | Move files or folders                             | `:truck:`             |
| `remove`   | Remove code or files                              | `:fire:`              |
| `ui`       | UI related changes                                | `:lipstick:`          |
| `revert`   | Revert changes                                    | `:rewind:`            |

For more types, refer to them `.agents/gitmoji.json`.

### 3. Scope (Optional)

The scope provides additional contextual information and is contained within parentheses, immediately following the type. It could be the name of the affected module, component, or feature area.

예시:

- `(components)`
- `(api)`
- `(auth)`
- `(layout)`

### 4. Description (Optional)

A brief summary of the changes made in the commit.

- Use the imperative mood (e.g., "add", "fix", "update").
- Keep it concise (ideally 50 characters or less).
- No period (.) at the end.

### 5. Body (Optional)

Provide a detailed explanation if necessary.

- Limit each line to 72 characters.
- Explain the reasons and background for the changes.
- Focus on what and why, rather than how.
- Use bullet points if there are multiple items.

### 6. Breaking Change (Optional)

Indicate if the commit introduces a breaking change. This section should start with the phrase `BREAKING CHANGE:` followed by a description of the change.

```
BREAKING CHANGE: The /auth/login endpoint now requires POST method instead of GET.
```

### 7. Footer (Optional)

Add issue tracking information.

```
Closes #123
Fixes #456
Relates to #789
```

## Examples

### Example 1: New Feature

```
:sparkles: feat(components): add new Button component

This button component provides a flexible and accessible way to
trigger user actions with support for multiple variants and sizes.
```

### Example 2: Bug Fix

```
:bug: fix(auth): resolve login form validation error

The validation was not properly checking email format before
submission, causing false validation failures.

Closes #234
```

### Example 3: Documentation Update

```
:memo: docs(readme): update setup instructions

- Added steps for configuring environment variables
- Clarified deployment process for Vercel
```

### Example 4: Performance Improvement

```
:zap: perf(components): optimize re-render in Card component

Memoized derived values to prevent unnecessary re-renders when
parent components update props that don't affect this component.
```

### Example 5: Breaking Change

```
:boom: feat(api): restructure authentication endpoints

BREAKING CHANGE: The /auth/login endpoint now requires POST method
instead of GET and returns a new token format.

Closes #456
```

### Example 6: Test Addition

```
:white_check_mark: test(components): add tests for Button component

Added comprehensive test coverage for all Button variants including
click handlers, disabled states, and accessibility features.
```

### Example 7: Code Style Improvement

```
:art: style(routes): format layout component files
```

### Example 8: Dependency Upgrade

```
:arrow_up: chore(deps): upgrade SvelteKit to 2.0.0

Updated dependencies to latest stable versions and resolved
peer dependency conflicts.
```

### Example 9: Code Refactoring

```
:recycle: refactor(api): improve user service and handlers

- Simplified user data fetching logic
- Removed deprecated methods
- Improved error handling for user-related operations
```

### Example 10: Add Dependency

```
:heavy_plus_sign: chore(axios): add axios for HTTP requests version 0.27.2
```

## Commonly Used Gitmoji

| Code                 | Emoji | Description   | When to Use                            |
| -------------------- | ----- | ------------- | -------------------------------------- |
| `:sparkles:`         | ✨    | New Feature   | When adding a new feature              |
| `:bug:`              | 🐛    | Bug Fix       | When fixing a bug                      |
| `:memo:`             | 📝    | Documentation | When writing or updating documentation |
| `:art:`              | 🎨    | Code Format   | When improving code style              |
| `:zap:`              | ⚡️    | Performance   | When improving performance             |
| `:recycle:`          | ♻️    | Refactoring   | When refactoring code                  |
| `:white_check_mark:` | ✅    | Test          | When adding or updating tests          |
| `:wrench:`           | 🔧    | Configuration | When changing configuration files      |
| `:fire:`             | 🔥    | Removal       | When removing code or files            |
| `:green_heart:`      | 💚    | CI            | When fixing CI builds                  |
| `:hammer:`           | 🔨    | Scripts       | When changing development scripts      |
| `:lipstick:`         | 💄    | UI            | When making UI or style changes        |
| `:rewind:`           | ⏪️    | Revert        | When reverting changes                 |
| `:truck:`            | 🚚    | Move          | When moving files or folders           |
| `:wheelchair:`       | ♿️    | Accessibility | When improving accessibility           |
| `:heavy_plus_sign:`  | ➕    | Addition      | When adding dependencies               |
| `:heavy_minus_sign:` | ➖    | Removal       | When removing dependencies             |
| `:arrow_up:`         | ⬆️    | Upgrade       | When upgrading dependencies            |
| `:arrow_down:`       | ⬇️    | Downgrade     | When downgrading dependencies          |

More Gitmoji can be found in the `.github/instructions/gitmoji.md`.

## References

- [Gitmoji Reference](https://gitmoji.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [SemVer](https://semver.org/)
