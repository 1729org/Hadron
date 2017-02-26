

export class BoardConstants {
	public static CREATE_BOARD_URL :string = '/board/create';
	public static GET_LAST_MODIFIED_BOARD_URL :string = '/board/latest';
	public static GET_BOARD_BY_NAME_URL :string = '/board/name';
	public static LIST_BOARDS_URL :string = '/board/list';
	public static CHANGE_BOARD_NAME_URL :string = '/board/changeName';


	public static CHANGE_TEXT_DOCUMENT_NAME_URL :string = '/textDocument/changeName';
	public static CREATE_TEXT_DOCUMENT_URL :string = '/textDocument/create';

	public static QUILL_MODULES :any = {
	  formula: true,
	  toolbar: [
	    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
	    ['blockquote', 'code-block'],

	    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
	    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
	    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
	    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
	    [{ 'direction': 'rtl' }],                         // text direction

	    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
	    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

	    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
	    [{ 'font': [] }],
	    [{ 'align': [] }],

	    ['clean'],                                         // remove formatting button

	    ['link', 'image', 'video'],                         // link and image, video
	    ['formula']
	  ]
	};
}