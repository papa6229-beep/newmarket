import { useRef, useState } from 'react';

function DropZone({ label, accept, multiple, files, onAdd, onRemove, color }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const colorMap = {
    blue: 'border-blue-300 hover:border-blue-400 hover:bg-blue-50',
    green: 'border-green-300 hover:border-green-400 hover:bg-green-50',
    purple: 'border-purple-300 hover:border-purple-400 hover:bg-purple-50',
  };
  const cls = colorMap[color] || colorMap.blue;

  const addFiles = (newFiles) => {
    const filtered = newFiles.filter(
      f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls')
    );
    if (!filtered.length) return;
    onAdd(multiple ? filtered : [filtered[0]]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${cls} ${dragging ? 'bg-blue-50 border-blue-400' : 'bg-white'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {/* multiple 속성을 조건부로 명시적 spread — multiple={false}시 속성 자체를 제거 */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          {...(multiple ? { multiple: true } : {})}
          style={{ display: 'none' }}
          onChange={e => {
            const picked = Array.from(e.target.files);
            if (picked.length) addFiles(picked);
            e.target.value = '';
          }}
        />
        <div className="text-3xl mb-2">📂</div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-1">
          클릭 또는 드래그&드롭 (.xlsx, .xls){multiple ? ' · 여러 파일 동시 선택 가능' : ''}
        </p>
      </div>

      {/* 선택된 파일 목록 */}
      {files && files.length > 0 && (
        <div className="space-y-1">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5"
            >
              <span className="text-gray-600 truncate mr-2">✅ {f.name}</span>
              <button
                onClick={() => onRemove(i)}
                className="text-gray-300 hover:text-red-400 transition-colors shrink-0 font-bold"
                title="파일 제거"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileUpload({ onDataLoaded, onError }) {
  const [salesFiles, setSalesFiles] = useState([]);
  const [couponFiles, setCouponFiles] = useState([]);
  const [adFiles, setAdFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // 파일 누적 추가 (중복 파일명 제외)
  const makeAdder = (setter) => (newFiles) => {
    setter(prev => {
      const existingNames = new Set(prev.map(f => f.name));
      const unique = newFiles.filter(f => !existingNames.has(f.name));
      return [...prev, ...unique];
    });
  };

  // 특정 인덱스 파일 제거
  const makeRemover = (setter) => (index) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleLoad = async () => {
    if (!salesFiles.length) {
      onError?.('기본매출 데이터 파일을 업로드해주세요.');
      return;
    }
    setLoading(true);
    try {
      const { parseSalesData, parseCouponData, parseAdData } = await import('../utils/excelParser.js');

      // 기본매출 파싱
      const salesData = await parseSalesData(salesFiles[0]);

      // 쿠폰이벤트: 모든 파일 병렬 파싱 후 통합
      const couponResults = await Promise.all(couponFiles.map(f => parseCouponData(f)));
      const couponData = couponResults.flat();

      // 광고: 모든 파일 병렬 파싱 후 통합
      const adResults = await Promise.all(adFiles.map(f => parseAdData(f)));
      const adData = adResults.flat();

      onDataLoaded({ salesData, couponData, adData, apiKey });
    } catch (err) {
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 마케팅 매출 분석</h1>
        <p className="text-gray-500 text-sm">표준화된 엑셀 파일을 업로드하면 자동으로 매출 분석과 전략을 제공합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">
            1. 기본매출 데이터 <span className="text-red-500">*필수</span>
          </p>
          <DropZone
            label="기본매출 파일 업로드"
            accept=".xlsx,.xls"
            multiple={false}
            files={salesFiles}
            onAdd={(f) => setSalesFiles(f)}
            onRemove={makeRemover(setSalesFiles)}
            color="blue"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-green-600 mb-1 uppercase tracking-wide">
            2. 쿠폰이벤트 데이터 <span className="text-gray-400">(선택)</span>
          </p>
          <DropZone
            label="쿠폰이벤트 파일 업로드"
            accept=".xlsx,.xls"
            multiple={true}
            files={couponFiles}
            onAdd={makeAdder(setCouponFiles)}
            onRemove={makeRemover(setCouponFiles)}
            color="green"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-purple-600 mb-1 uppercase tracking-wide">
            3. 광고 데이터 <span className="text-gray-400">(선택)</span>
          </p>
          <DropZone
            label="광고 파일 업로드"
            accept=".xlsx,.xls"
            multiple={true}
            files={adFiles}
            onAdd={makeAdder(setAdFiles)}
            onRemove={makeRemover(setAdFiles)}
            color="purple"
          />
        </div>
      </div>

      {/* Anthropic API Key */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs font-semibold text-amber-700 mb-2">🤖 AI 전략 분석 (선택) — Anthropic API 키</p>
        <input
          type="password"
          className="w-full text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
          placeholder="sk-ant-... (전략 제안 탭의 AI 분석에 사용)"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
        />
        <p className="text-xs text-amber-500 mt-1">API 키는 브라우저에서 직접 사용되며 저장되지 않습니다.</p>
      </div>

      <button
        onClick={handleLoad}
        disabled={loading || !salesFiles.length}
        className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow"
      >
        {loading ? '⏳ 데이터 분석 중...' : '🚀 분석 시작'}
      </button>

      {/* 컬럼 안내 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="font-semibold text-gray-600 mb-1">기본매출 컬럼</p>
          <p>날짜, 전체매출, 방문자수, 주문수, 신규 가입자수, 신규회원 매출, 기존회원 매출, 환불금액</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="font-semibold text-gray-600 mb-1">쿠폰이벤트 컬럼</p>
          <p>이벤트명, 날짜, 쿠폰 사용 매출, 쿠폰 사용 주문수, 쿠폰 사용 고객수, 쿠폰 사용 신규/기존회원수, 쿠폰 사용 신규/기존회원 매출</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="font-semibold text-gray-600 mb-1">광고 컬럼 (시트명: 광고일별데이터)</p>
          <p>날짜, 광고명, 광고비, 광고로잡힌매출, 전환수, 신규전환수, 발송수, 도달수, 오픈수, 유입수</p>
        </div>
      </div>
    </div>
  );
}
