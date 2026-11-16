/**
 * 전시용 계정. 토큰 인증이 없고 프론트가 직접 맞춰본다.
 *
 * 계정마다 작업 공간 키가 다르다. 같은 계정으로 로그인하면 어느 기기에서든
 * 같은 보관함이 열리고, 다른 계정이면 보관함·가게 정보가 완전히 갈린다.
 * 리허설과 실전을 가르거나, 기기·조를 나눌 때 쓴다.
 *
 * 키는 바꾸면 안 된다. 바꾸는 순간 그 계정으로 만든 광고를 다시 찾을 수 없다.
 * shop 은 처음 로그인했을 때 채워 두는 값이고, 마이에서 고치면 그 기기에 남는다.
 */
export type ExhibitionAccount = {
  username: string;
  password: string;
  /** 서버가 작업 공간을 가르는 64자리 키 */
  guestKey: string;
  shop: { name: string; marketName: string; description: string };
};

export const ACCOUNTS: readonly ExhibitionAccount[] = [
  {
    username: '1111',
    password: '1111',
    // 계정이 1234 하나뿐이던 시절의 키다. 그때 만든 광고가 이 계정에 남아 있다.
    guestKey: 'bb3883e3a1329827d2887aa939bbf85d7a0359a3e6f885a9cc33053467f3bfa2',
    shop: {
      name: '연남떡볶이',
      marketName: '망원시장',
      description: '20년째 같은 자리에서 즉석떡볶이를 만들어요. 고추장을 직접 담가 씁니다.',
    },
  },
  {
    username: '2222',
    password: '2222',
    guestKey: '4f7939135784336a42b6abb7e491a0ac0d4c73eb41aa3fdf6039709c49a33f3e',
    shop: {
      name: '창억떡집',
      marketName: '경동시장',
      description: '새벽에 쪄서 그날 다 파는 떡집이에요. 팥은 국산만 씁니다.',
    },
  },
  {
    username: '3333',
    password: '3333',
    guestKey: '30008d26184ad65bf3821604eb013da1d374569e8ae7b0d134cd93f5ecfdffde',
    shop: {
      name: '온기반찬',
      marketName: '영천시장',
      description: '매일 아침 만든 반찬만 내놓아요. 남은 건 다음 날 팔지 않습니다.',
    },
  },
  {
    username: '4444',
    password: '4444',
    guestKey: '6ced405ece3284c7bd3e3c70e80f2f5d3869a3d5aadfbe49aaf6b287f3d01f64',
    shop: {
      name: '할매순대국',
      marketName: '남대문시장',
      description: '가마솥에 열두 시간 고아낸 국물로 끓입니다. 새벽 다섯 시에 문을 열어요.',
    },
  },
  {
    username: '5555',
    password: '5555',
    guestKey: '1ca953c67b1694f02d6c2cfc08efe244b25c8856cca27e4a6a1f79457692dba7',
    shop: {
      name: '소금빵공방',
      marketName: '광장시장',
      description: '버터를 아끼지 않고 굽는 작은 빵집이에요. 한 판씩만 구워 바로 냅니다.',
    },
  },
  {
    username: '6666',
    password: '6666',
    guestKey: 'd63ac91a673e81215f9a81231a64bd8696bba4cdec11cbd3517a1d7f53118d8e',
    shop: {
      name: '제철과일상회',
      marketName: '가락시장',
      description: '그날 들어온 제철 과일만 놓습니다. 맛보고 사실 수 있어요.',
    },
  },
  {
    username: '7777',
    password: '7777',
    guestKey: '72e0e17171bfb8cef46888e0e7d96bf200d92531dbcec7cd65309880ece81d47',
    shop: {
      name: '바다새우공방',
      marketName: '자갈치시장',
      description: '새우를 껍질째 튀겨 바삭합니다. 기름은 하루에 두 번 갈아요.',
    },
  },
  {
    username: '8888',
    password: '8888',
    guestKey: '2497291485c0c64897261c3af24b37c6fa8bde57ad9f80eba7fb2ad85df15d71',
    shop: {
      name: '종로닭강정',
      marketName: '통인시장',
      description: '주문 들어오면 그때 튀깁니다. 단맛을 덜어 짭짤한 쪽이에요.',
    },
  },
  {
    username: '9999',
    password: '9999',
    guestKey: '9b102d2aa2dff07805154a6526aca7e1cfc50365a6718045c3a335fefc44461c',
    shop: {
      name: '손칼국수집',
      marketName: '모란시장',
      description: '반죽을 손으로 밀어 그날 뽑습니다. 멸치 육수를 아침마다 새로 냅니다.',
    },
  },
];

export const findAccount = (username: string, password: string): ExhibitionAccount | undefined =>
  ACCOUNTS.find((account) => account.username === username && account.password === password);

export const findAccountByGuestKey = (guestKey: string): ExhibitionAccount | undefined =>
  ACCOUNTS.find((account) => account.guestKey === guestKey);

/**
 * 로그인 상태와 작업 공간 키를 담는 자리.
 * 전시 내내 같은 탭이 떠 있지만 새로고침과 재부팅이 있을 수 있어 localStorage 를 쓴다.
 * sessionStorage 면 그때마다 운영자를 다시 불러야 한다.
 */
export const AUTH_STORAGE_KEY = 'posttalk.signedIn';
export const GUEST_KEY_STORAGE_KEY = 'posttalk.guestKey';
