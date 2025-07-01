import * as React from "react";
import { EditorUtils, EditorToolsSettings } from "@progress/kendo-react-editor";
import { EditorInsertImageDialog } from "./EditorInsertImageDialog";
import { Button } from '@progress/kendo-react-buttons';

const imageSettings = EditorToolsSettings.image;

export const InsertImage = (props) => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const toggleDialog = () => setOpenDialog(!openDialog);
    const { view } = props;
    const state = view && view.state;
    const nodeType = state ? state.schema.nodes[imageSettings.node] : undefined;

    return (
        <>
            <Button
                onClick={toggleDialog}
                disabled={
                    !nodeType ||
                    !state ||
                    !EditorUtils.canInsert(state, nodeType)
                }
                onMouseDown={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
                title="Insert Image"
                {...imageSettings.props}
            />
            {openDialog && view && (
                <EditorInsertImageDialog
                    key="insertImageDialog"
                    view={view}
                    onClose={toggleDialog}
                    imageNode={imageSettings.node}
                />
            )}
        </>
    );
};
