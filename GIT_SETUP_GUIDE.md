# Git Setup and GitHub Push Guide

This guide will help you initialize Git, create a GitHub repository, and push your StudyPlanner project.

## Prerequisites
- Git installed on your computer
- GitHub account created

## Step 1: Initialize Git Repository

Open terminal/command prompt in your StudyPlanner folder:

```bash
cd "C:\Users\.."
```

Initialize Git:
```bash
git init
```

You should see: `Initialized empty Git repository`

## Step 2: Configure Git (First Time Only)

If you haven't set up Git before, configure your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Example:
```bash
git config --global user.name "Shubhreet Kaur"
git config --global user.email "shubhreet@example.com"
```

## Step 3: Stage All Files

Add all project files to Git:

```bash
git add .
```

Check what will be committed:
```bash
git status
```

You should see all your files listed in green.

## Step 4: Create Initial Commit

Commit your files with a descriptive message:

```bash
git commit -m "Initial commit: Sprint 1 backend complete with PostgreSQL and JWT auth"
```

You should see a summary of files added.

## Step 5: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon (top right) → **New repository**
3. Fill in the details:
   - **Repository name:** `StudyPlanner`
   - **Description:** `Full-stack student assignment tracker - PROG2500 course project`
   - **Visibility:** Public or Private (your choice)
   - **DO NOT** initialize with README (you already have one)
4. Click **Create repository**

## Step 6: Connect Local Repository to GitHub

GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/StudyPlanner.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**Example:**
```bash
git remote add origin https://github.com/shubhreetkaur/StudyPlanner.git
git branch -M main
git push -u origin main
```

You may be prompted to log in to GitHub. Enter your credentials.

## Step 7: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. The README.md should display on the repository homepage

## Making Future Changes

After making changes to your code:

### 1. Check what changed
```bash
git status
```

### 2. Stage changes
```bash
# Stage all changes
git add .

# Or stage specific files
git add backend/routes/courses.js
```

### 3. Commit with descriptive message
```bash
git commit -m "feat: add course filtering by semester"
```

### 4. Push to GitHub
```bash
git push
```

## Good Commit Message Examples

Follow this format: `type: description`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `style:` - Formatting changes

**Examples:**
```bash
git commit -m "feat: implement user authentication with JWT"
git commit -m "fix: handle missing authorization header"
git commit -m "docs: update API documentation"
git commit -m "refactor: improve error handling in routes"
git commit -m "feat: add assignment status filter endpoint"
```

## Useful Git Commands

### View commit history
```bash
git log
# Or prettier format
git log --oneline --graph
```

### View changes before committing
```bash
git diff
```

### Undo changes (before commit)
```bash
# Undo changes to specific file
git checkout -- filename.js

# Undo all changes
git checkout -- .
```

### View remote repository URL
```bash
git remote -v
```

### Update from GitHub (if you work on multiple computers)
```bash
git pull
```

### Create a new branch
```bash
git checkout -b feature-name
```

### Switch branches
```bash
git checkout main
```

## Branch Strategy (Optional but Recommended)

For cleaner development:

### Main branch (production code)
```bash
git checkout main
```

### Create feature branch
```bash
git checkout -b sprint2-frontend
```

### Work on feature, commit changes
```bash
git add .
git commit -m "feat: create React dashboard component"
```

### Push feature branch
```bash
git push -u origin sprint2-frontend
```

### Merge to main (when feature is complete)
```bash
git checkout main
git merge sprint2-frontend
git push
```

## Troubleshooting

### "Permission denied" error
**Solution:** Set up SSH key or use personal access token instead of password
- GitHub Guide: https://docs.github.com/en/authentication

### "Failed to push" error
**Solution:** Pull changes first, then push
```bash
git pull
git push
```

### "Detached HEAD" state
**Solution:** Create a new branch or checkout main
```bash
git checkout main
```

### Want to undo last commit
```bash
# Keep changes but undo commit
git reset --soft HEAD~1

# Discard changes and commit
git reset --hard HEAD~1
```

### Accidentally committed .env file
```bash
# Remove from Git but keep locally
git rm --cached backend/.env
git commit -m "fix: remove .env from version control"
git push
```

## .gitignore Best Practices

Your project already has `.gitignore` files that prevent committing:
- `node_modules/` - Dependencies (too large)
- `.env` - Secrets and credentials
- `logs/` - Log files
- `.vscode/` - Editor settings
- `.DS_Store` - Mac system files

**Never commit:**
- Database credentials
- API keys
- JWT secrets
- Personal access tokens
- node_modules folder

## GitHub Repository Settings

### For Sprint 1 Submission

Make sure your repository:
1. ✅ Has a clear README.md
2. ✅ Has regular commits (not just one)
3. ✅ Has descriptive commit messages
4. ✅ Does NOT contain .env file
5. ✅ Has proper .gitignore
6. ✅ Is accessible (public or instructor has access)

### Add Instructor as Collaborator (If Private Repo)

1. Go to repository Settings
2. Click "Collaborators" in left sidebar
3. Click "Add people"
4. Enter instructor's GitHub username
5. Select role: Read access
6. Click "Add to repository"

## Commit History Example for Sprint 1

Good commit history shows progression:

```
* fix: improve assignment validation error messages
* docs: add API testing guide
* feat: add assignment CRUD endpoints
* feat: implement course CRUD operations
* feat: add JWT authentication middleware
* feat: setup user authentication routes
* feat: configure PostgreSQL database connection
* chore: setup Express server and project structure
* docs: add README and project documentation
* Initial commit: Sprint 1 backend complete
```

You should have **at least 10-15 commits** for Sprint 1.

## Pre-Submission Checklist

Before submitting, verify:

```bash
# Check all changes are committed
git status
# Should show: "nothing to commit, working tree clean"

# Check commits are pushed to GitHub
git log origin/main..HEAD
# Should show: "no commits" (all pushed)

# View your commit history
git log --oneline
# Should show multiple descriptive commits
```

## Quick Command Reference

```bash
# Initial setup (once)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main

# Regular workflow (repeated)
git add .
git commit -m "type: description"
git push

# Check status
git status
git log --oneline

# View changes
git diff

# Update from GitHub
git pull
```

## Need Help?

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/
- Course instructor or TAs
- Git cheat sheet: https://education.github.com/git-cheat-sheet-education.pdf

---

## Next Steps After Git Setup

1. ✅ Push to GitHub
2. ✅ Verify all files uploaded
3. ✅ Copy repository URL
4. ✅ Add URL to SPRINT1_SUBMISSION_TEMPLATE.txt
5. ✅ Deploy to Render (see DEPLOYMENT_GUIDE.md)
6. ✅ Test deployed API
7. ✅ Prepare for live demo

---

**You're ready to submit! 🎉**

Remember: Commit early, commit often, and write clear commit messages!
