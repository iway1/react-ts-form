---
sidebar_position: 1
---

# TypeScript versions

## 4.9+ required for intellisense

Older versions of typescript have worse intellisense and may not show an error in your editor. Make sure your editors typescript version is set to v4.9 plus. The easiest approach is to upgrade your typescript globally if you haven't recently:

```sh
sudo npm -g upgrade typescript
```

Or, in VSCode you can do (Command + Shift + P) and search for "Select Typescript Version" to change your editors Typescript Version:

![Screenshot 2023-01-01 at 10 55 11 AM](https://user-images.githubusercontent.com/12774588/210178740-edafa8d1-5a69-4e36-8852-c0a01f36c35d.png)

Note that you can still compile with older versions of typescript and the type checking will work.
