<script>
    import { json } from "@codemirror/lang-json";
    import CodeMirror from "svelte-codemirror-editor";
    import { mode } from "mode-watcher";
    
    let { content = $bindable() } = $props();

    let isDarkMode = $derived($mode === 'dark');
    let codeMirrorStyles = $derived({
            "&": {
                width: "100%",
                maxWidth: "800px",
                height: "100%",
                minHeight: "200px",
                fontFamily: "monospace",
                fontSize: "14px",
                backgroundColor: isDarkMode ? "#282c34" : "#f8f8f8",
                color: isDarkMode ? "#FFFFFF" : "#333",
                border: `1px solid ${isDarkMode ? "#5c6370" : "#ddd"}`,
                borderRadius: "5px",
                padding: "15px",
            },
            ".cm-content": {
                padding: "0",
            },
            ".cm-line": {
                padding: "0 5px",
                lineHeight: "1.4",
            },
            ".cm-indentation": {
                color: isDarkMode ? "#6b829e" : "#999",
            },
            ".cm-atom": {
                color: isDarkMode ? "#c678dd" : "#2196f3",
                fontWeight: "bold",
            },
            ".cm-string": {
                color: isDarkMode ? "#98c379" : "#a0522d",
            },
            ".cm-number": {
                color: isDarkMode ? "#d19a66" : "#008080",
            },
            ".ͼb": {
                color: isDarkMode ? "#56b6c2" : "#0000ff",
                fontWeight: "normal",
            },
            ".cm-comment": {
                color: isDarkMode ? "#5c6370" : "#8e908c",
                fontStyle: "italic",
            },
            ".cm-operator": {
                color: isDarkMode ? "#abb2bf" : "#000",
            },
            ".cm-meta": {
                color: isDarkMode ? "#56b6c2" : "#708090",
            },
            ".cm-gutters": {
                backgroundColor: isDarkMode ? "#282c34" : "#f8f8f8",
                color: "#ddd",
                border: "none"
            }
            ,
        });
</script>
  
<CodeMirror bind:value={content} lang={json()} styles={codeMirrorStyles}/>