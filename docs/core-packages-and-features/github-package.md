---
title: GitHub package
layout: doc.ejs
---

The GitHub package brings Git and GitHub integration right inside Pulsar.

- [Initialize](#initialize-repositories)
- [Clone](#clone-repositories)
- [Branch](#branch)
- [Stage](#stage)
- [Discard](#discard-changes)
- [Commit](#commit)
- [Amend and undo](#amend-and-undo)
- [Publish and push](#publish-and-push)
- [Fetch and pull](#fetch-and-pull)
- [Resolve conflicts](#resolve-conflicts)
- [Create a pull request](#create-a-pull-request)
- [View pull requests](#view-pull-requests)
- [Checkout a pull request](#checkout-a-pull-request)
- [Open any Issue or pull request](#open-any-issue-or-pull-request)
- [View pull request review comments](#view-pull-request-review-comments)
- [Navigate pull request review comments](#navigate-pull-request-review-comments)
- [Respond to a pull request review comment](#respond-to-a-pull-request-review-comment)

Most of the functionality lives within the Git and GitHub dock items.

![The Git and GitHub panels](/img/atom/github-panels.png "The Git and GitHub panels")

There are different ways to access these dock items:

- Toggle the **Git** panel with [[Ctrl+Shift+9]] (the **GitHub: Toggle Git Tab** command)
- Toggle the **GitHub** panel with [[Ctrl+Shift+8]] (the **GitHub: Toggle GitHub Tab** command)

These commands will flip their respective tabs between visible and hidden. If invoked when their tab is already visible, these commands will hide the dock.

Or you can also toggle the Git panel from the status bar by clicking on the changed files icon:

![Open Git panel](/img/atom/github-open-git-panel.png "Open Git panel")

Two similar commands can be used to move keyboard focus to each tab:

- Focus the **Git** panel with [[Ctrl+9]] (the **GitHub: Toggle Git Tab Focus** command)
- Focus the **GitHub** panel with [[Ctrl+8]] (the **GitHub: Toggle GitHub Tab Focus** command)

These commands will move focus to their respective tabs when invoked once — revealing the tab if it’s hidden — then move the focus back to where it was when invoked a second time.

---

## Initialize repositories

In case a project doesn't have a Git repository yet, you can create one from the Git panel.

![Initialize repositories](/img/atom/github-initialize.png "Initialize repositories")

## Clone repositories

To clone a repository, open the GitHub panel while you have no project folders open in Pulsar and click **Clone an existing GitHub repository**. In the dialog, paste the URL of a repository and click **Clone**. The new project will be added to the tree view.

![GitHub panel](/img/atom/github-without-projects.png "GitHub panel without projects")

![Clone dialog](/img/atom/github-clone.png "Clone repositories")

Alternately, run the `GitHub: Clone` command to open the Clone dialog any time.

## Branch

To open the branch tooltip, click the branch icon in the status bar. From there you can **create** or **switch** branches.

![Create or switch branches](/img/atom/github-branch.png "Create or switch branches")

## Stage

After making some changes, **stage** anything you want to be part of the next commit. Choose between staging...

- **All changes**: Click the "Stage All" button in the "Unstaged Changes" bar.
- **Files**: Double-click a file or select a file and press [[Enter]].
- **Hunk**: Click on the "Stage Hunk" button or select a hunk and press [[Enter]].
- **Lines**: Click on a line (or drag on multiple lines) to select, then click
  on the "Stage Selection" button. Or use the <kbd class="platform-linux platform-win">Ctrl+/</kbd><kbd class="platform-mac">Cmd+/</kbd> key to toggle from hunk mode to line mode, then
  press <kbd class="platform-linux platform-win">Ctrl+Enter</kbd><kbd class="platform-mac">Cmd+Enter</kbd> to stage just a single line.

Use the <kbd class="platform-linux platform-win">Ctrl+Left</kbd><kbd class="platform-mac">Cmd+Left</kbd> or <kbd class="platform-linux platform-win">Ctrl+Right</kbd><kbd class="platform-mac">Cmd+Right</kbd> arrow keys to switch between file list and the diff view. Unstaging can be done in the same way.

![Stage changes](/img/atom/github-stage.png "Stage changes")

## Discard changes

If you no longer want to keep some changes, you can discard them. It's similar to staging, but accessible behind a context menu.

- **All changes**: Click the [[...]] menu in the "Unstaged Changes"
  header and choose "Discard All Changes".
- **Files**: Right-click a file (or multiple) and choose "Discard Changes".
- **Hunk**: Click on the trash icon in the top bar of a hunk.
- **Lines**: Right-click on a line (or multiple) and choose "Discard Selection".

![Discard changes](/img/atom/github-discard.png "Discard changes")

## Commit preview

To double check **all changes** that are going into your next commit, click the "**See All Staged Changes**" button above the commit message box. It lets you see all of your staged changes in a single pane. This "commit preview" can also serve as an inspiration for writing the commit message.

![Commit Preview](/img/atom/github-commit-preview.png "Commit Preview")

## Commit

Once you've staged your changes, enter a commit **message**. Feel free to describe the commit in more detail after leaving an empty line. Finalize by clicking the **Commit** button. If you need more space, click the expand icon at the bottom right. It will open a commit editor in the center.

![Commit changes](/img/atom/github-commit.png "Commit changes")

To add multiple **co-authors** to a commit, click the "👤➕" icon in the bottom left corner of the commit message editor. Now you can search by name, email or GitHub username to give credit to a co-author.

![Commit with co-authors](/img/atom/github-commit-with-co-authors.png "Commit with co-authors")

## Amend and undo

In case you forgot to commit a change and would like to add it to your previous commit, right-click on the last commit, then choose "Amend" from the context menu.

![Amend previous commit](/img/atom/github-amend.png "Amend previous commit")

If you want to edit the commit message of your last commit, or add/remove changes, click on the "Undo" button. It will roll back to the state just before you clicked on the commit button.

![Undo previous commit](/img/atom/github-undo.png "Undo previous commit")

## View commits

Once you've made some commits, click on a commit message in the recent commit list to see the full diff and commit message associated with each:

![View commit detai](/img/atom/github-commit-detail.png "View commit detai")

## Publish and push

When you're ready to share your changes with your team members, click the **Publish** button in the status bar. It will push your local branch to the remote repository. After making more commits, you can **Push** them as well from the status bar.

![Publish and push commits](/img/atom/github-publish-push.png "Publish and push commits")

## Fetch and pull

From time to time it's a good idea to click on the **Fetch** button to see if any other team member pushed changes. If so, click on **Pull** to merge the changes into your local branch.

![Fetch and pull commits](/img/atom/github-fetch-pull.png "Fetch and pull commits")

If you prefer to **rebase** when pulling, you can configure Git to make it the default behavior:

```sh
git config --global --bool pull.rebase true
```

Learn more about [merge vs. rebase](https://mislav.net/2013/02/merge-vs-rebase/).

## Resolve conflicts

Sometimes there can be conflicts when trying to merge. Files that have merge conflicts will show up in the "Merge Conflicts" list. Click on a file to open the editor. There you can **resolve** the conflict by picking a version or make further edits. Once done, stage the file and commit.

![Resolve conflicts](/img/atom/github-resolve-conflicts.png "Resolve conflicts")

## Create a pull request

When your changes are ready to be reviewed by your team members, open the "GitHub" panel [[Ctrl+8]] and click on **Open new pull request**. It will open the browser where you can continue creating a pull request. If commits haven't been pushed or the branch isn't published yet, the GitHub package will do that automatically for you.

![Create a pull request](/img/atom/github-create-a-pull-request.png "Create a pull request")

## View pull requests

Once the pull request is created, it will appear under **Current Pull Request** at the top of the panel. Underneath is a list of **Open Pull Requests**. It lets you quickly find a pull request by avatar, title or PR number. It also lets you keep an eye on the CI status. Clicking on a pull request in the list opens a center pane with more details, the timeline and conversations.

![View pull requests](/img/atom/github-view-pull-requests.png "View pull requests")

## Open any issue or pull request

You can open issues or pull requests from any repo on GitHub. To do so, run the **GitHub: Open Issue Or Pull Request** command and paste the URL from an issue or pull request. Then press the **Open Issue or Pull Request** button and it will open a center pane. This lets you keep an issue or pull request as a reference when working in another repo.

![Open Issue or pull request](/img/atom/github-open-issue-or-pull-request.png "Open Issue or Pull Request")

## Checkout a pull request

To test a pull request locally, open it in the workspace center by clicking on the pull request in the "open pull requests" list from the GitHub tab, then click on the **Checkout** button. It will automatically create a local branch and pull all the changes. If you would like to contribute to that pull request, start making changes, commit and push. Your contribution is now part of that pull request.

![Checkout a pull request](/img/atom/github-checkout.png "Checkout a pull request")

## View pull request review comments

To view review comments on a pull request, open the Reviews tab from the **See Reviews** button from the footer of a pull request Pane. Alternatively, if the pull request has already been checked out, the Reviews tab can also be opened from the same button on the GitHub tab.

![Open review tab from footer](/img/atom/github-see-review-footer.png "Open review tab from footer")

## Navigate pull request review comments

You can see all the review summaries and comments of a pull request in the Reviews Tab. The comment section has a progress bar to help you keep track of how close are you to finish addressing the pull request comments (i.e. marking all comment threads on a pull request as "resolved"). Comment threads are greyed out after they have been resolved.

![Review tab](/img/atom/github-review-tab.png "Review tab")

After the pull request branch has been checked out, you can click **Jump To File** to open the commented on file and make changes as per the review comment right in the editor. If you would like to get the full context of the review comment, click **Open Diff** to open the diff view with line highlighting.

![Jump to file from review tab](/img/atom/github-review-jump-to-file.png "Jump to file from review tab")

Conversely, in-editor comments are indicated by the comment icon in the gutter. Clicking the icon, either from within the editor or the diff view, will take you back to the Reviews Tab.

![Open review tab from diff](/img/atom/github-open-review-from-diff.png "Open review tab from diff")

## Respond to a pull request review comment

To respond to a pull request review comment, type your message and click **Comment**; a single line comment will be created in the same thread as the comment you responded to. After addressing a pull request review comment, click **Resolve conversation** to mark the whole thread as "resolved". The progress bar in the "Comments" section will update accordingly.

![Respond to a pull request review comment](/img/atom/github-review-reply.png "Respond to a pull request review comment")
