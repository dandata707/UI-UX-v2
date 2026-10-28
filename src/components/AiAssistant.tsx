import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, Check, ChevronRight, MapPin, MessageCircle, Sparkles, Star } from 'lucide-react';
import { MotorbikeOption, Shop } from '../types/wireframe';
import { getBikeQuestions, NemoBikeAnalysis, NemoBikeQuestionAnswer } from './NemoBikeAnalysis';

export function AiAssistantEntry({ onClick, detail = false }: { onClick: () => void; detail?: boolean }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3.5 text-left shadow-xs transition-colors hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-blue-600">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white shadow-sm"><Sparkles size={20} /></span>
      <span className="min-w-0 flex-1"><span className="flex items-center gap-2 text-xs font-bold text-slate-900">{detail ? 'Nemo phân tích chiếc xe này' : 'Tìm xe cùng Nemo'}<span className="rounded bg-white px-1.5 py-0.5 text-[8px] font-semibold text-blue-700">AI DEMO</span></span><span className="mt-1 block text-[10px] leading-4 text-slate-500">{detail ? 'Xem ngay ưu, nhược điểm và gợi ý lựa chọn' : 'Trợ lý AI giúp chọn xe hợp chuyến đi'}</span></span>
      <ChevronRight size={16} className="shrink-0 text-blue-600" />
    </button>
  );
}

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + 'đ';
const suggestions = ['Tay ga dưới 150k/ngày, đi trong phố', 'Xe số tiết kiệm, gần trung tâm', 'Tìm Honda Vision, giao tận nơi'];

// Scripted, local matching for the interactive mockup; no model or API calls.
function recommend(query: string, shops: Shop[]) {
  const text = normalize(query);
  const budgetMatch = text.match(/(?:duoi|toi da|tam|khoang|ngan sach)\s*([\d.,]+)\s*(k|nghin|ngan|trieu|tr)?/);
  const budgetValue = budgetMatch ? Number(budgetMatch[1].replace(/[.,]/g, '')) : undefined;
  const budget = budgetValue === undefined ? undefined : budgetValue * (/^(tr|trieu)$/.test(budgetMatch![2] || '') ? 1000000 : budgetValue < 1000 ? 1000 : 1);
  const type = /tay ga/.test(text) ? 'Tay ga' : /xe so/.test(text) ? 'Xe số' : /xe con|cao cao/.test(text) ? 'Xe côn/Cào cào' : undefined;
  const model = ['vision', 'wave', 'sirius', 'exciter', 'air blade'].find((name) => text.includes(name));
  const delivery = /giao.*(noi|khach san|homestay)/.test(text);
  const cheap = /tiet kiem|gia re/.test(text);
  const nearby = /gan|trung tam/.test(text);
  const matches = shops.flatMap((shop) => shop.options.map((option) => ({ shop, option })))
    .filter(({ option }) => (!budget || option.dailyRate <= budget) && (!type || option.bikeType === type) && (!model || normalize(option.bikeName).includes(model)))
    .sort((a, b) => {
      const score = ({ shop, option }: { shop: Shop; option: MotorbikeOption }) => shop.rating * 10 - (nearby ? shop.distanceKm * 8 : 0) - (cheap ? option.dailyRate / 10000 : 0) + (delivery && option.deliveryFee === 0 ? 5 : 0);
      return score(b) - score(a);
    });
  return matches.slice(0, 3).map(({ shop, option }) => ({
    shop, option,
    reasons: [
      budget ? `Trong ngân sách ${money(budget)}/ngày` : `Giá thuê ${money(option.dailyRate)}/ngày`,
      type ? `Đúng loại ${type.toLowerCase()} bạn muốn` : `Cửa hàng được đánh giá ${shop.rating}/5`,
      delivery ? (option.deliveryFee === 0 ? 'Phí giao nhận theo bảng giá: 0đ' : `Phí giao nhận: ${money(option.deliveryFee)}`) : `Cách vị trí của bạn ${shop.distanceKm} km`,
    ],
  }));
}

interface AiAssistantProps {
  shops: Shop[];
  selectedOption?: MotorbikeOption;
  onSelectOption: (option: MotorbikeOption, shop: Shop) => void;
  onBack: () => void;
  initialQuery?: string;
  onQueryChange: (query: string) => void;
}

export function AiAssistant({ shops, selectedOption, onSelectOption, onBack, initialQuery = '', onQueryChange }: AiAssistantProps) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(initialQuery);
  const recommendations = submitted ? recommend(submitted, shops) : [];
  const suggestedQuestions = selectedOption ? getBikeQuestions(selectedOption) : suggestions;
  const submit = (value: string) => { if (value.trim()) { setSubmitted(value.trim()); onQueryChange(value.trim()); setInput(''); } };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)]">
      <header className="shrink-0 border-b border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
        <div className="mb-4 flex items-center gap-3"><button type="button" onClick={onBack} aria-label="Quay lại từ Nemo" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700"><ArrowLeft size={19} /></button><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white"><Sparkles size={21} /></span><div className="flex-1"><h1 className="text-base font-extrabold text-slate-900">Nemo</h1><p className="mt-0.5 text-[10px] text-slate-500">Trợ lý AI chọn xe của bạn</p></div><span className="rounded-full border border-blue-200 bg-white px-2 py-1 text-[9px] font-semibold text-blue-700">DEMO</span></div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{selectedOption ? 'Hiểu chiếc xe trước khi chọn' : 'Bạn muốn đi đâu hôm nay?'}</h2>
        <p className="mt-1 text-[11px] leading-4 text-slate-500">{selectedOption ? 'Ưu điểm, điểm cần cân nhắc và gợi ý từ Nemo.' : 'Kể về nhu cầu của bạn, mình sẽ giúp chọn xe.'}</p>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {selectedOption && submitted && <button type="button" onClick={() => { setSubmitted(''); onQueryChange(''); }} className="flex min-h-9 items-center gap-1.5 rounded-lg bg-blue-50 px-3 text-[11px] font-semibold text-blue-700"><Sparkles size={13} />Xem lại phân tích chiếc xe này</button>}
        {selectedOption && <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2"><img src={selectedOption.imageUrl} alt="" className="h-10 w-12 rounded-lg object-cover" /><div className="min-w-0"><p className="text-[9px] text-slate-500">ĐANG CÂN NHẮC</p><p className="truncate text-[11px] font-bold">{selectedOption.bikeName}</p></div></div>}
        {!submitted ? <>
          {selectedOption ? <NemoBikeAnalysis option={selectedOption} shops={shops} /> : <div className="flex gap-2"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Sparkles size={15} /></span><div className="rounded-2xl rounded-tl-sm bg-white p-3 text-[11px] leading-5 text-slate-600">Chào bạn, mình là Nemo! Bạn thích loại xe nào và ngân sách khoảng bao nhiêu mỗi ngày? Mình có thể tìm xe và giải thích vì sao xe phù hợp với nhu cầu của bạn.</div></div>}
        </> : <>
          <div className="ml-8 rounded-2xl rounded-br-sm bg-[var(--color-primary)] px-3 py-2.5 text-[11px] leading-5 text-white">{submitted}</div>
          {selectedOption ? <NemoBikeQuestionAnswer option={selectedOption} shops={shops} question={submitted} onSelectOption={onSelectOption} /> : <>
          <div role="status" className="text-[11px] leading-5 text-slate-600"><span className="mb-1 flex items-center gap-1.5 font-bold text-blue-700"><Sparkles size={14} /> Gợi ý dành cho bạn</span>{recommendations.length ? `Mình tìm được ${recommendations.length} phương án theo yêu cầu. Bạn có thể xem lý do và mở chi tiết bên dưới.` : 'Chưa có xe khớp yêu cầu trong danh sách mẫu. Hãy thử tăng ngân sách hoặc chọn loại xe khác.'}</div>
          {recommendations.map(({ shop, option, reasons }, index) => <article key={option.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex gap-2.5 p-3"><img src={option.imageUrl} alt={option.bikeName} className="h-16 w-20 rounded-xl object-cover" /><div className="min-w-0 flex-1"><span className={`text-[9px] font-bold ${index === 0 ? 'text-blue-600' : 'text-slate-500'}`}>{index === 0 ? 'ƯU TIÊN CÂN NHẮC' : 'LỰA CHỌN THÊM'}</span><h3 className="mt-0.5 text-xs font-bold leading-4">{option.bikeName}</h3><p className="mt-1 text-xs font-extrabold text-blue-600">{money(option.dailyRate)}<span className="text-[9px] font-normal text-slate-500"> / ngày</span></p></div></div>
            <ul className="space-y-1 px-3 pb-2">{reasons.map((reason) => <li key={reason} className="flex items-center gap-1.5 text-[10px] text-slate-600"><Check size={12} className="shrink-0 text-emerald-600" />{reason}</li>)}</ul>
            <div className="mx-3 flex items-center justify-between gap-2 border-t border-slate-100 py-2 text-[9px] text-slate-500"><span className="flex items-center gap-1"><MapPin size={11} />{shop.distanceKm} km <Star size={10} className="ml-1 fill-amber-400 text-amber-500" />{shop.rating}</span><button type="button" onClick={() => onSelectOption(option, shop)} className="flex min-h-8 items-center gap-1 rounded-lg bg-blue-50 px-2 text-[10px] font-bold text-blue-700">Xem chi tiết <ChevronRight size={12} /></button></div>
          </article>)}
          </>}
        </>}
        {(!submitted || selectedOption) && <div className="space-y-2" aria-label={selectedOption ? 'Câu hỏi về chiếc xe đang xem' : 'Gợi ý tìm xe'}><p className="text-[10px] font-semibold text-slate-500">{selectedOption ? 'HỎI THÊM NEMO VỀ CHIẾC XE NÀY' : 'THỬ MỘT GỢI Ý'}</p>{suggestedQuestions.map((text) => <button key={text} type="button" onClick={() => submit(text)} aria-pressed={submitted === text} className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[11px] leading-5 text-blue-700 ${submitted === text ? 'border-blue-300 bg-blue-50 font-semibold' : 'border-blue-100 bg-white hover:bg-blue-50'}`}><MessageCircle size={13} className="shrink-0" /><span className="flex-1">{text}</span><ChevronRight size={13} className="shrink-0" /></button>)}</div>}
      </div>

      <form onSubmit={(event) => { event.preventDefault(); submit(input); }} className="shrink-0 border-t border-slate-200 bg-white p-3">
        <label htmlFor="ai-request" className="sr-only">Mô tả nhu cầu thuê xe</label>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 pl-3 focus-within:border-blue-400"><input id="ai-request" value={input} onChange={(event) => setInput(event.target.value)} maxLength={500} placeholder={selectedOption ? 'Hỏi Nemo về chiếc xe này…' : 'Ví dụ: Tay ga dưới 150k/ngày…'} className="min-w-0 flex-1 bg-transparent py-2 text-[11px] outline-none" /><button type="submit" aria-label="Gửi nhu cầu" disabled={!input.trim()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white disabled:opacity-35"><ArrowUp size={18} /></button></div>
        <p className="mt-2 text-center text-[8px] leading-3 text-slate-400">Mockup tương tác • Gợi ý từ dữ liệu mẫu, chưa xác nhận xe còn trống.</p>
      </form>
    </div>
  );
}
