/**
 * 用户信息
 */
export interface Info {
  account: string;
  avatarUrl: string;
  birthday: number;
  diamond: number;
  email: string;
  experience: number;
  free_room_card: number;
  gender: number;
  id: number;
  integral: number;
  last_login_time: number;
  level: number;
  mobile: '0' | number;
  nickname: string;
  openId: null | number;
  register_time: number;
  room_card: number;
  session: string;
  signature: null | number;
  small_talk_id: null | number;
  token: string;
}
