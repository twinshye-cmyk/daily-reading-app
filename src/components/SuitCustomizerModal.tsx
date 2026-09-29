import React, { useState } from 'react';
import { SpiderSuitTheme, UserProfile } from '../types';
import { SPIDER_SUITS, HappyMascot } from './HappyMascot';
import { X, Check, Sparkles, Shield, Palette } from 'lucide-react';

interface SuitCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSuit: SpiderSuitTheme;
  onSelectSuit: (suit: SpiderSuitTheme) => void;
  activeProfile?: UserProfile;
}

export const SuitCustomizerModal: React.FC<SuitCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentSuit,
  onSelectSuit,
  activeProfile,
}) => {
  const [selectedSuit, setSelectedSuit] = useState<SpiderSuitTheme>(currentSuit);

  if (!isOpen) return null;

  const currentSuitObj = SPIDER_SUITS.find((s) => s.id === selectedSuit) || SPIDER_SUITS[0];

  const handleApply = (suitId: SpiderSuitTheme) => {
    setSelectedSuit(suitId);
    onSelectSuit(suitId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-lg shadow-md">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">스파이더 수트 드레스룸</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/40">
                  {SPIDER_SUITS.length}가지 테마
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                {activeProfile ? `${activeProfile.name} 님의 ` : ''}공부 메이트 수트 컬러를 자유롭게 선택하세요!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Area */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0">
              <HappyMascot
                expression="proud"
                suitTheme={selectedSuit}
                size="lg"
                showSpeech={false}
                interactive={false}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">{currentSuitObj.icon}</span>
                <h4 className="text-sm font-black text-slate-900">{currentSuitObj.name}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                  {currentSuitObj.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {currentSuitObj.desc}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentSuitObj.themeColor }} />
                <span className="text-[10px] text-slate-500 font-bold">
                  {selectedSuit === currentSuit ? '✅ 현재 장착 중인 수트' : '👆 아래에서 원하는 수트를 선택하세요'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Suit Options Grid */}
        <div className="p-4 sm:p-5 max-h-[50vh] overflow-y-auto space-y-2.5">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            수트 컬러 목록 (클릭 즉시 장착)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SPIDER_SUITS.map((suit) => {
              const isSelected = selectedSuit === suit.id;
              const isCurrent = currentSuit === suit.id;

              return (
                <button
                  key={suit.id}
                  onClick={() => handleApply(suit.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50/80 border-red-500 ring-2 ring-red-400 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="p-1.5 bg-slate-100 rounded-xl shrink-0">
                    <HappyMascot
                      expression="happy"
                      suitTheme={suit.id}
                      size="sm"
                      showSpeech={false}
                      interactive={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs">{suit.icon}</span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {suit.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{suit.badge} · {suit.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            언제든지 클릭 한 번으로 수트를 바꿀 수 있습니다. 🕸️
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>장착 완료</span>
          </button>
        </div>

      </div>
    </div>
  );
};
