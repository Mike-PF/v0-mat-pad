import { EditorUtils } from "@progress/kendo-react-editor";

export const insertImageFiles = ({ view, files, nodeType, position, attrs = {} }) => {
    if (EditorUtils.canInsert(view.state, nodeType)) {
        files.forEach((file) => {
            let reader = new FileReader();
            reader.onload = function (e) {
                const image = nodeType.createAndFill({
                    ...attrs,
                    src: e.target.result,
                });
                if (position) {
                    view.dispatch(view.state.tr.insert(position.pos, image));
                } else {
                    EditorUtils.insertNode(view, image, true);
                }
            };
            reader.readAsDataURL(file);
        });
    }
};

export const cleanStyles = (attr, type) => {
    if (!attr || !attr.value) return null;

    if (type === 'basic-editor') {
        attr.value = attr.value.replace(/(font-family|font-size)\s*:([^;]*);/g, '');
    }

    return attr.value.trim();
}