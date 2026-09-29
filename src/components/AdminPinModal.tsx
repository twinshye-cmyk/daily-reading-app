import React, { useState, useEffect } from 'react';
import { Crown, Lock, KeyRound, X, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { verifyAdminPin, setAdminPin } from '../utils/storage';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'verify' | 'change';
  targetActionName?: string;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode = 'verify',
  targetActionName = '관리자(열공마미) 모드 전환',
}) => {
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setNewPin('');
      setConfirmPin('');
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('관리자 PIN 번호를 입력해주세요.');
      return;
    }

    if (verifyAdminPin(pin)) {
      setError(null);
      onSuccess();
      onClose();
    } else {
      setError('관리자 PIN 번호가 일치하지 않습니다.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAdminPin(pin)) {
      setError('현재 관리자 PIN 번호가 일치하지 않습니다.');
      return;
    }
    if (newPin.trim().length < 4) {
      setError('새 PIN 번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('새 PIN 번호와 확인 번호가 일치하지 않습니다.');
      return;
    }

    const success = setAdminPin(newPin);
    if (success) {
      setSuccessMsg('관리자 PIN 번호가 성공적으로 변경되었습니다!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } else {
      setError('PIN 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/40 border border-purple-400/40 flex items-center justify-center text-sm font-black">
              <Crown className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                {mode === 'change' ? '관리자 PIN 번호 변경' : '관리자 보안 인증 (열공마미)'}
              </h3>
              <p className="text-[10px] text-purple-200 font-medium">
                {mode === 'change' ? '총괄 관리자 비밀번호를 재설정합니다.' : targetActionName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {mode === 'verify' ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-[11px] text-purple-900 leading-relaxed font-medium flex items-start gap-2">
                <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black">학습자 권한 보호 알림:</span>
                  <p className="text-[10px] text-purple-800 mt-0.5">
                    다른 학습자의 기록 조회 및 프로필 삭제, 기록 초기화는 관리자(열공마미)만 가능합니다.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  관리자 PIN 번호 입력
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={12}
                    autoFocus
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError(null);
                    }}
                    placeholder="4자리 이상 숫자 입력"
                    className="w-full px-3.5 py-2.5 text-center text-lg font-black tracking-widest bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                  <span>관리자 인증 & 전환</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePin} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">현재 PIN 번호</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="현재 PIN 입력"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-600 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">새 PIN 번호 (4자리 이상)</label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="새 PIN 입력"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-600 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">새 PIN 번호 확인</label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="새 PIN 재입력"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-600 font-bold"
                />
              </div>

              {error && (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>변경 저장</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
