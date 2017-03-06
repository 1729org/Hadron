var BoardConstants = (function () {
    function BoardConstants() {
    }
    return BoardConstants;
}());
export { BoardConstants };
BoardConstants.CREATE_BOARD_URL = '/board/create';
BoardConstants.GET_LAST_MODIFIED_BOARD_URL = '/board/latest';
BoardConstants.GET_BOARD_BY_NAME_URL = '/board/name';
BoardConstants.LIST_BOARDS_URL = '/board/list';
BoardConstants.CHANGE_BOARD_NAME_URL = '/board/changeName';
BoardConstants.CHANGE_TEXT_DOCUMENT_NAME_URL = '/textDocument/changeName';
BoardConstants.CREATE_TEXT_DOCUMENT_URL = '/textDocument/create';
BoardConstants.SAVE_TEXT_DOCUMENT_URL = '/textDocument/save';
BoardConstants.QUILL_MODULES = {
    formula: true,
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video'],
        ['formula']
    ]
};
BoardConstants.QUILL_SAVE_INTERVAL = 15;
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board/board.constants.js.map