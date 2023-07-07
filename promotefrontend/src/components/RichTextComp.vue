<template id="sdfdfsdf">
  <div id="containerRich">
    <div id="textfield" ref="workingTextarea"></div>
  </div>
</template>
<script>
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";

export default {
  data() {
    return {
      workingTextarea: null,
      placeholder: "",
      keywordLength: 0,
      mainTextfield: [],
      keywords: '',
      localResponse: this.$store.state.gptResponse.text,
    };
  },
  watch: {
    "$store.state.gptResponse.text": function () {
      console.log(this.workingTextarea)
      if (this.workingTextarea.getLength() > 1) {
        this.workingTextarea.insertText(this.workingTextarea.getLength(), '', 'bold', true);
      }
      this.workingTextarea.insertText(
        this.workingTextarea.getLength(),
        this.$store.state.gptResponse.text,
        {
          color: "#ffff00",
          italic: true,
        }
      );
    },
  },

  mounted() {
    this.workingTextarea = new Quill(this.$refs.workingTextarea, {
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction

          [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme

          [{ font: [] }],
          [{ align: [] }],

          ["clean"], // remove formatting button
        ],
      },
      theme: "snow",
      placeholder: this.placeholder,
      formats: ["bold", "underline", "header", "italic", "link"],
    });

    //add listener for ENTER
    this.workingTextarea.keyboard.bindings[13].unshift({
      key: 13,
      handler: () => {
        var delta = this.workingTextarea.getContents();
        this.mainTextfield = '/n /n' + delta.ops[0].insert;
        console.log(this.mainTextfield);
        if (this.popupVisible) {
          return false;
        }
        return true;
      },
    });

    this.workingTextarea.on("text-change", function (source) {
      if (source == "api") {
        console.log("An API call triggered this change.");
      } else if (source == "user") {
        console.log("A user action triggered this change.");
      }
    });
  },
};
</script>

<style></style>