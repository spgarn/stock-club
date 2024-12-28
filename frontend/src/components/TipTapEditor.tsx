
import StarterKit from "@tiptap/starter-kit";
import {
    LinkBubbleMenu,
    LinkBubbleMenuHandler,
    MenuButtonAddImage,
    MenuButtonAlignCenter,
    MenuButtonAlignLeft,
    MenuButtonAlignRight,
    MenuButtonBlockquote,
    MenuButtonBold,
    MenuButtonBulletedList,
    MenuButtonEditLink,
    MenuButtonIndent,
    MenuButtonItalic,
    MenuButtonOrderedList,
    MenuButtonStrikethrough,
    MenuButtonUnderline,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
    type RichTextEditorRef,
} from "mui-tiptap";
import { useEffect, useRef, useState } from "react";
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { TextAlign } from '@tiptap/extension-text-align'
import { Link } from '@tiptap/extension-link'
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import { Underline } from '@tiptap/extension-underline'
import { Image } from '@tiptap/extension-image'
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { css, styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { translate } from "../i18n";
import { Button, TextField } from "@mui/material";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
};
const ModalContent = styled('div')(
    ({ theme }) => css`
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 500;
      text-align: start;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border-radius: 8px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      box-shadow: 0 4px 12px
        ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
      padding: 24px;
      color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
  
      & .modal-title {
        margin: 0;
        line-height: 1.5rem;
        margin-bottom: 8px;
      }
  
      & .modal-description {
        margin: 0;
        line-height: 1.5rem;
        font-weight: 400;
        color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
        margin-bottom: 4px;
      }
    `,
);

export default function TipTapEditor({ content, label, onChange }: { content: string, label: string, onChange: (text: string) => void }) {
    const rteRef = useRef<RichTextEditorRef>(null);
    const imageLinkRef = useRef<HTMLInputElement>(null);
    const editor = rteRef.current?.editor;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    useEffect(() => {
        if (!editor || editor.isDestroyed) {
            return;
        }
        if (!editor.isFocused || !editor.isEditable) {
            queueMicrotask(() => {
                const currentSelection = editor.state.selection;
                editor
                    .chain()
                    .setContent(content)
                    .setTextSelection(currentSelection)
                    .run();
            });
        }
    }, [content, editor, editor?.isEditable, editor?.isFocused]);

    const addImage = () => {
        const url = imageLinkRef.current?.value ?? "";
        console.log(url);
        console.log(imageLinkRef.current);
        editor?.chain().focus().setImage({ src: url }).run()
    }
    return (
        <>
            <RichTextEditor
                onUpdate={(v) => onChange(v.editor.getHTML())}
                ref={rteRef}
                extensions={[
                    StarterKit,
                    TextStyle,
                    Color,
                    TextAlign.configure({
                        types: ['heading', 'paragraph']  // This specifies which node types can be aligned
                    }),
                    Link,
                    BubbleMenu,
                    LinkBubbleMenuHandler,
                    Underline,
                    Image
                ]}
                content={content}
                renderControls={() => (
                    <MenuControlsContainer>
                        <p>{label}</p>
                        <MenuSelectHeading tooltipTitle={translate["styles"]} labels={{
                            paragraph: <>{translate["paragraph"]}</>,
                            heading1: <>{translate["heading"]} 1</>,
                            heading2: <>{translate["heading"]} 2</>,
                            heading3: <>{translate["heading"]} 3</>,
                            heading4: <>{translate["heading"]} 4</>,
                            heading5: <>{translate["heading"]} 5</>,
                            heading6: <>{translate["heading"]} 6</>,
                        }} />
                        <MenuDivider />
                        <MenuButtonBold tooltipLabel={translate["bold"]} />
                        <MenuButtonItalic tooltipLabel={translate["italic"]} />
                        <MenuButtonStrikethrough tooltipLabel={translate["strikethrough"]} />
                        <MenuButtonUnderline tooltipLabel={translate["underline"]} />
                        <MenuButtonBlockquote tooltipLabel={translate["blockquote"]} />
                        <MenuButtonEditLink tooltipLabel={translate["link"]} />
                        <MenuButtonOrderedList tooltipLabel={translate["ordered_list"]} />
                        <MenuButtonBulletedList tooltipLabel={translate["bulleted_list"]} />
                        <MenuButtonIndent tooltipLabel={translate["indent"]} />
                        <MenuButtonAlignLeft tooltipLabel={translate["left_align"]} />
                        <MenuButtonAlignCenter tooltipLabel={translate["center_align"]} />
                        <MenuButtonAlignRight tooltipLabel={translate["right_align"]} />
                        <MenuButtonAddImage onClick={() => handleOpen()} tooltipLabel={translate["insert_image"]} />
                        <LinkBubbleMenu />
                        <input
                            type="color"
                            value={editor?.getAttributes('textStyle').color || '#000000'}
                            onChange={e => {
                                // For mui-tiptap, we can use the TextStyle mark directly
                                editor?.chain().focus().setMark('textStyle', { color: e.target.value }).run();
                            }}
                            className="w-8 h-8 p-0 border rounded cursor-pointer"
                            title="Change text color"
                        />

                    </MenuControlsContainer>
                )}
            />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <ModalContent sx={style}>
                        <h2 id="transition-modal-title" className="modal-title">
                            {translate["add_image_link"]}
                        </h2>
                        <TextField inputRef={imageLinkRef} label={translate["enter_image_link"]} placeholder={"https://www.test.com/image.png"} />
                        <Button onClick={() => {
                            addImage();
                            handleClose();
                        }}>{translate["save"]}</Button>
                    </ModalContent>
                </Fade>
            </Modal>
        </>
    );
}