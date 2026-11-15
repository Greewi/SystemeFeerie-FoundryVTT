import { SFUtility } from "../utility.js";

// This partial entry is used to show the value of the intormation Items that have a value.
export class SFSystemItemDirectory extends foundry.applications.sidebar.tabs.ItemDirectory {
    static _entryPartial = SFUtility.getSystemRessource("templates/sidebar/document-partial.html");
}