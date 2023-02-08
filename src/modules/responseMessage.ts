const message = {
  NULL_VALUE: '필요한 값이 없습니다.',
  NOT_FOUND: '잘못된 경로입니다.',
  BAD_REQUEST: '잘못된 요청입니다.',
  INTERNAL_SERVER_ERROR: '서버 내부 오류',

  NULL_VALUE_TOKEN: '만료된 토큰입니다.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다.',
  EMPTY_TOKEN: '토큰 값이 없습니다.',
  CREATE_TOKEN_SUCCESS: '토큰 재발급 성공',

  //유저
  SIGNUP_SUCCESS: '회원 가입 성공',
  SIGNIN_SUCCESS: '로그인 성공',
  NO_USER: '존재하지 않는 유저입니다.',
  CREATE_USER_FAIL: '유저 생성 실패',
  READ_PROFILE_SUCCESS: '마이페이지 조회 성공',

  //계획 블록
  READ_PLAN_SUCCESS: '계획블록 조회 성공',
  UPDATE_PLAN_SUCCESS: '계획블록 수정 성공',
  UPDATE_PLAN_FAIL: '계획블록 수정 실패',
  CREATE_PLAN_SUCCESS: '계획블록 생성 성공',
  DELETE_PLAN_SUCCESS: '계획블록 삭제 성공',
  DELETE_PLAN_FAIL: '계획블록 삭제 실패',
  MOVE_PLAN_ORDER_SUCCESS: '계획블록 순서 이동 및 변경 성공',
  READ_CALENDAR_PLAN_SUCCESS: '날짜별 계획블록 존재여부 조회 성공',

  //데일리 노트
  READ_DAILYNOTE_SUCCESS: '데일리노트 조회 성공',
  CREATE_DAILYNOTE_SUCCESS: '데일리노트 작성 성공',

  //타임 블록
  FETCH_TIMEBLOCK_SUCCESS: '타임블록 조회 성공',
  UPDATE_TIMEBLOCK_SUCCESS: '타임블록 업데이트 성공',
};

export default message;
