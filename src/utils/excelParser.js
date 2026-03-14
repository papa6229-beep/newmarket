import * as XLSX from 'xlsx';

// 날짜 파싱 (엑셀 숫자 날짜 또는 문자열)
function parseDate(value) {
  if (!value && value !== 0) return null;
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return new Date(date.y, date.m - 1, date.d);
    }
  }
  if (typeof value === 'string') {
    const d = new Date(value);
    if (!isNaN(d)) return d;
  }
  if (value instanceof Date) return value;
  return null;
}

// null/undefined는 null로, 숫자만 숫자로
function parseNum(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}

// 워크시트의 행 데이터를 객체 배열로 변환
function sheetToRows(worksheet) {
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null, raw: true });
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] !== undefined ? row[i] : null;
    });
    return obj;
  }).filter(row => Object.values(row).some(v => v !== null));
}

// 기본매출 데이터 파싱
export function parseSalesData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array', cellDates: false });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = sheetToRows(ws);

        const parsed = rows.map(row => {
          const dateVal = row['날짜'] ?? row['date'] ?? row['Date'];
          return {
            date: parseDate(dateVal),
            totalSales: parseNum(row['전체매출'] ?? row['총매출']),
            visitors: parseNum(row['방문자수']),
            orders: parseNum(row['주문수']),
            newMembers: parseNum(row['신규 가입자수'] ?? row['신규가입자수']),
            newMemberSales: parseNum(row['신규회원 매출'] ?? row['신규회원매출']),
            existingMemberSales: parseNum(row['기존회원 매출'] ?? row['기존회원매출']),
            refundAmount: parseNum(row['환불금액']),
          };
        }).filter(r => r.date);

        resolve(parsed);
      } catch (err) {
        reject(new Error('기본매출 데이터 파싱 오류: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류'));
    reader.readAsArrayBuffer(file);
  });
}

// 쿠폰이벤트 데이터 파싱
export function parseCouponData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array', cellDates: false });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = sheetToRows(ws);

        const parsed = rows.map(row => {
          const dateVal = row['날짜'] ?? row['date'];
          return {
            eventName: row['이벤트명'] ?? row['이벤트 명'] ?? '이벤트',
            date: parseDate(dateVal),
            couponSales: parseNum(row['쿠폰 사용 매출'] ?? row['쿠폰사용매출']),
            couponOrders: parseNum(row['쿠폰 사용 주문수'] ?? row['쿠폰사용주문수']),
            couponCustomers: parseNum(row['쿠폰 사용 고객수'] ?? row['쿠폰사용고객수']),
            couponNewMembers: parseNum(row['쿠폰 사용 신규회원수'] ?? row['쿠폰사용신규회원수']),
            couponExistingMembers: parseNum(row['쿠폰 사용 기존회원수'] ?? row['쿠폰사용기존회원수']),
            couponNewMemberSales: parseNum(row['쿠폰 사용 신규회원 매출'] ?? row['쿠폰사용신규회원매출']),
            couponExistingMemberSales: parseNum(row['쿠폰 사용 기존회원 매출'] ?? row['쿠폰사용기존회원매출']),
          };
        }).filter(r => r.date);

        resolve(parsed);
      } catch (err) {
        reject(new Error('쿠폰이벤트 데이터 파싱 오류: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류'));
    reader.readAsArrayBuffer(file);
  });
}

// 광고 데이터 파싱 (시트명: 광고일별데이터)
export function parseAdData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array', cellDates: false });
        // 시트명 "광고일별데이터" 우선, 없으면 첫 번째
        const sheetName = wb.SheetNames.find(n => n.includes('광고일별')) || wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rows = sheetToRows(ws);

        const parsed = rows.map(row => {
          const dateVal = row['날짜'] ?? row['date'];
          return {
            date: parseDate(dateVal),
            adName: row['광고명'] ?? row['광고 명'] ?? '광고',
            adCost: parseNum(row['광고비']),
            adAttributedSales: parseNum(row['광고로잡힌매출'] ?? row['광고 귀속 매출']),
            conversions: parseNum(row['전환수']),
            newConversions: parseNum(row['신규전환수']),
            sends: parseNum(row['발송수']),
            reach: parseNum(row['도달수']),
            opens: parseNum(row['오픈수']),
            inflows: parseNum(row['유입수']),
          };
        }).filter(r => r.date);

        resolve(parsed);
      } catch (err) {
        reject(new Error('광고 데이터 파싱 오류: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류'));
    reader.readAsArrayBuffer(file);
  });
}
