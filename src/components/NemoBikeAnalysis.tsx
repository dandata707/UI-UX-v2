import React from 'react';
import { ArrowRight, Check, CircleAlert, Sparkles, ThumbsUp } from 'lucide-react';
import { MotorbikeOption, Shop } from '../types/wireframe';
import { formatMoney } from '../utils/rental';

interface NemoBikeAnalysisProps {
  option: MotorbikeOption;
  shops: Shop[];
}

export function getBikeQuestions(option: MotorbikeOption) {
  const name = option.bikeName.split('(')[0].trim();
  return [
    `Thuê ${name} 2 ngày hết bao nhiêu?`,
    'Xe này có phù hợp với người mới không?',
    'Thuê xe này cần giấy tờ và tiền cọc gì?',
    'So với xe cùng loại, xe này có đáng chọn?',
  ];
}

export function NemoBikeQuestionAnswer({ option, shops, question, onSelectOption }: NemoBikeAnalysisProps & {
  question: string;
  onSelectOption: (option: MotorbikeOption, shop: Shop) => void;
}) {
  const text = question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
  const peers = shops.flatMap((shop) => shop.options.map((bike) => ({ option: bike, shop })))
    .filter((item) => item.option.id !== option.id && item.option.bikeType === option.bikeType)
    .sort((a, b) => a.option.dailyRate - b.option.dailyRate);
  const isComparison = /so voi|so sanh|cung loai/.test(text);
  let answer: string;
  if (/giay to|tien coc|dat coc|coc gi/.test(text)) {
    answer = `Với ${option.bikeName}, điều kiện trong dữ liệu mẫu là: ${option.deposit}. ${option.requirements.length ? `Yêu cầu kèm theo: ${option.requirements.join('; ')}.` : ''}`;
  } else if (/nguoi moi|de lai|moi lai/.test(text)) {
    answer = option.bikeType === 'Tay ga'
      ? `${option.bikeName} là tay ga, không cần thao tác sang số nên đáng cân nhắc nếu bạn đã quen dòng xe này. Nemo không thể xác nhận mức phù hợp thực tế chỉ từ thông số; hãy thử tư thế ngồi và thao tác điều khiển khi nhận xe.`
      : option.bikeType === 'Xe số'
        ? `${option.bikeName} cần thao tác sang số. Nếu bạn mới chỉ quen tay ga, hãy cân nhắc một xe tay ga thay vì chọn xe này chỉ vì giá thuê. Nếu đã quen xe số, bạn có thể đưa xe vào danh sách cân nhắc.`
        : `${option.bikeName} thuộc nhóm xe côn/cào cào. Nemo gợi ý ưu tiên khi bạn đã quen điều khiển côn và sang số; đây không phải lựa chọn đầu tiên cho người chưa quen dòng xe này.`;
  } else if (isComparison) {
    const cheaper = peers.filter((item) => item.option.dailyRate < option.dailyRate);
    answer = cheaper.length
      ? `${option.bikeName} có giá ${formatMoney(option.dailyRate)}/ngày. Có ${cheaper.length} phương án cùng loại rẻ hơn trong danh sách mẫu. Nếu ưu tiên tiết kiệm, hãy đối chiếu thêm phí giao và điều kiện cọc của các xe bên dưới.`
      : `${option.bikeName} có giá ${formatMoney(option.dailyRate)}/ngày, hiện thuộc nhóm giá thấp nhất cùng loại trong danh sách mẫu. Đây là điểm đáng cân nhắc nếu ưu tiên ngân sách; bạn vẫn nên đối chiếu phí giao và tiền cọc.`;
  } else if (/bao nhieu|chi phi|gia thue|het bao|\d+\s*ngay/.test(text)) {
    const days = Math.min(365, Math.max(1, Number(text.match(/(\d+)\s*ngay/)?.[1] ?? 2)));
    answer = `Ước tính 1 xe ${option.bikeName} trong ${days} ngày: ${formatMoney(option.dailyRate)} × ${days} = ${formatMoney(option.dailyRate * days)} tiền thuê. Nhận tại cửa hàng: ${formatMoney(option.dailyRate * days)}. Nếu giao tận nơi, cộng ${formatMoney(option.deliveryFee)} phí giao nhận, tổng ${formatMoney(option.dailyRate * days + option.deliveryFee)}. Tiền cọc tính riêng theo điều kiện của cửa hàng.`;
  } else {
    answer = `Nemo đang tư vấn riêng cho ${option.bikeName} (${option.bikeType}, ${option.engine}), giá ${formatMoney(option.dailyRate)}/ngày. Bạn có thể hỏi về chi phí, giấy tờ và tiền cọc, mức phù hợp với người mới hoặc so sánh với xe cùng loại bằng các gợi ý bên dưới.`;
  }
  return <div className="space-y-3"><section aria-label="Nemo trả lời về chiếc xe đang xem" className="rounded-2xl border border-blue-100 bg-white p-3.5"><h3 className="flex items-center gap-1.5 text-xs font-bold text-blue-700"><Sparkles size={14} />Nemo trả lời</h3><p role="status" className="mt-2 whitespace-pre-line text-[11px] leading-5 text-slate-700">{answer}</p></section>
    {isComparison && peers.slice(0, 3).map((item) => <article key={item.option.id} className="rounded-xl border border-slate-200 bg-white p-3"><h4 className="text-[11px] font-bold">{item.option.bikeName}</h4><p className="mt-1 text-[10px] leading-5 text-slate-500">{formatMoney(item.option.dailyRate)}/ngày · Phí giao {formatMoney(item.option.deliveryFee)}</p><p className="mt-1 text-[10px] leading-5 text-slate-600">Cọc: {item.option.deposit}</p><button type="button" onClick={() => onSelectOption(item.option, item.shop)} className="mt-2 flex min-h-9 items-center gap-1 rounded-lg bg-blue-50 px-3 text-[11px] font-bold text-blue-700">Xem phương án này<ArrowRight size={13} /></button></article>)}
  </div>;
}

// Scripted assessment for the mockup, using the selected vehicle and catalog.
export function NemoBikeAnalysis({ option, shops }: NemoBikeAnalysisProps) {
  const shop = shops.find((item) => item.id === option.shopId);
  const peers = shops.flatMap((item) => item.options).filter((item) => item.bikeType === option.bikeType);
  const cheapest = peers.length ? Math.min(...peers.map((item) => item.dailyRate)) : option.dailyRate;
  const cheaperCount = peers.filter((item) => item.dailyRate < option.dailyRate).length;
  const style = option.bikeType === 'Tay ga'
    ? { strength: 'Không cần thao tác sang số khi di chuyển.', limitation: 'Nếu ưu tiên ngân sách, nên so sánh thêm các phương án xe số.', fit: 'Bạn muốn thao tác đơn giản, vi vu phố hoặc ghé các điểm tham quan.' }
    : option.bikeType === 'Xe số'
      ? { strength: 'Có thể chủ động chọn số theo tình huống di chuyển.', limitation: 'Cần quen thao tác sang số; hãy cân nhắc nếu bạn chỉ quen tay ga.', fit: 'Bạn đã quen xe số và muốn một lựa chọn linh hoạt cho chuyến đi.' }
      : { strength: 'Thích hợp để cân nhắc nếu bạn muốn trải nghiệm dòng xe côn.', limitation: 'Cần quen điều khiển côn và sang số; không nên chọn chỉ vì kiểu dáng.', fit: 'Bạn đã quen xe côn và ưu tiên trải nghiệm điều khiển.' };
  const strengths = [style.strength];
  const limitations = [style.limitation];
  if (option.dailyRate === cheapest) strengths.push(`Giá ${formatMoney(option.dailyRate)}/ngày, thấp nhất nhóm ${option.bikeType.toLowerCase()} trong danh sách mẫu.`);
  else limitations.push(`Có ${cheaperCount} phương án cùng loại rẻ hơn; giá thấp nhất từ ${formatMoney(cheapest)}/ngày.`);
  if (option.deliveryFee === 0) strengths.push('Phí giao nhận mẫu 0đ, thuận tiện nếu bạn cần giao xe.');
  else limitations.push(`Phí giao nhận ${formatMoney(option.deliveryFee)} nếu chọn giao tận nơi, cần cộng vào ngân sách.`);
  if (shop && strengths.length < 3) strengths.push(`Cửa hàng đạt ${shop.rating}/5 từ ${shop.reviewCount} lượt đánh giá mẫu.`);

  return <section aria-label={`Nemo phân tích ${option.bikeName}`} className="space-y-3">
    <div className="flex items-start gap-2"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Sparkles size={15} /></span><div className="flex-1 rounded-2xl rounded-tl-sm border border-blue-100 bg-white p-3"><p className="text-xs font-bold text-blue-700">Nemo đã phân tích chiếc xe này</p><p className="mt-1 text-[11px] leading-5 text-slate-600">Mình tổng hợp ưu, nhược điểm để bạn dễ cân nhắc trước khi chọn <strong>{option.bikeName}</strong>.</p></div></div>
    <div className="rounded-2xl border border-emerald-600/20 bg-emerald-50 p-3.5"><h3 className="flex items-center gap-2 text-xs font-bold text-emerald-800"><ThumbsUp size={16} />Ưu điểm</h3><ul className="mt-3 space-y-2">{strengths.map((text) => <li key={text} className="flex items-start gap-2 text-[11px] leading-5 text-slate-700"><Check size={13} className="mt-1 shrink-0 text-emerald-700" />{text}</li>)}</ul></div>
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5"><h3 className="flex items-center gap-2 text-xs font-bold text-amber-800"><CircleAlert size={16} />Nhược điểm & điểm cần cân nhắc</h3><ul className="mt-3 space-y-2">{limitations.map((text) => <li key={text} className="flex items-start gap-2 text-[11px] leading-5 text-slate-700"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-600" />{text}</li>)}</ul><div className="mt-3 border-t border-amber-200 pt-2 text-[10px] leading-5 text-amber-900"><strong>Chuẩn bị giấy tờ/cọc:</strong> {option.deposit}</div></div>
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3.5"><h3 className="flex items-center gap-1.5 text-xs font-bold text-blue-700"><Sparkles size={15} />Nemo gợi ý chọn khi…</h3><p className="mt-2 text-[11px] leading-5 text-slate-700">{style.fit}</p><p className="mt-2 text-[10px] leading-5 text-slate-500">Phân tích minh họa từ dòng xe và dữ liệu mẫu, không phải đánh giá tình trạng thực tế của xe.</p></div>
  </section>;
}
