---
sidebar_position: 1
---

# TypeScript versions

## 4.9+ required for intellisense

Older versions of TypeScript have worse IntelliSense and may not show an error in your editor. Make sure your editors TypeScript version is set to `v4.9+`. The easiest approach is to upgrade your TypeScript globally if you haven't recently:

```sh
sudo npm -g upgrade typescript
```

Or, in VSCode you can do (`Ctrl/Command` + `Shift` + `P`) and search for "Select Typescript Version" to change your editors Typescript Version:

![Screenshot 2023-01-01 at 10 55 11 AM](https://user-images.githubusercontent.com/12774588/210178740-edafa8d1-5a69-4e36-8852-c0a01f36c35d.png)

Note that you can still compile with older versions of TypeScript and the type checking will work.
