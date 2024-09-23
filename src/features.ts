export const features = {
  TaskTagsView: true,
  TaskTagInput: true,
  ImportantTaskView: true,
  ToggleTaskImportant: true,
  LinkifyLinkInTask: true,
  LinksListDrawer: true,
  TasksCountInTitle: true,
  TagFilter: true,
  TaskTypeInputInCreateTask: true,
  CopyTaskTextInDrawer: true,
}

export type Features = typeof features
export type Feature = keyof Features
