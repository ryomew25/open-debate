import { Link } from "react-router";
import { ArrowLeft, MessageSquare } from "lucide-react";

const SECTIONS = [
  {
    title: "第1条（目的）",
    body: `本利用規約（以下「本規約」）は、Duel（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意したうえで本サービスをご利用ください。`,
  },
  {
    title: "第2条（利用登録）",
    body: `本サービスはニックネーム（2〜20文字）のみで参加できます。メールアドレス・パスワード等の個人情報は収集しません。入力された名前はブラウザの localStorage にのみ保存され、外部サーバーへ送信されることはありません。`,
  },
  {
    title: "第3条（禁止事項）",
    items: [
      "他者への誹謗・中傷・脅迫・差別的発言",
      "性的・暴力的・反社会的なコンテンツの投稿",
      "個人情報（氏名・住所・電話番号等）の公開",
      "スパム・連続投稿・サービスへの過負荷行為",
      "著作権・商標権等の知的財産権の侵害",
      "法令または公序良俗に反する行為",
      "その他、運営が不適切と判断する行為",
    ],
  },
  {
    title: "第4条（コンテンツの権利）",
    body: `ユーザーが本サービスに投稿したコンテンツの著作権はユーザー本人に帰属します。ただし、ユーザーは本サービスの運営に必要な範囲でコンテンツを利用・表示する権限を運営に対して許諾するものとします。`,
  },
  {
    title: "第5条（サービスの停止・変更）",
    body: `運営は以下の場合、事前通知なくサービスを停止・変更できます。システムの保守・点検・緊急対応が必要な場合、天災・停電・障害等により運営が困難な場合、その他運営上やむを得ない事情が生じた場合。サービス停止・変更によって生じた損害について、運営は一切の責任を負いません。`,
  },
  {
    title: "第6条（免責事項）",
    body: `本サービスはモックデータを用いた実験的なプロジェクトです。運営は本サービスの完全性・正確性・有用性を保証しません。ユーザー間のトラブルは当事者間で解決するものとし、運営は介入・調停・損害賠償の責任を負いません。`,
  },
  {
    title: "第7条（通報・モデレーション）",
    body: `ユーザーは、禁止事項に該当すると思われる投稿を通報機能にて報告できます。運営は通報内容を確認し、必要に応じてコンテンツの削除やユーザーの利用停止を行います。通報の処理結果についてはお知らせしない場合があります。`,
  },
  {
    title: "第8条（プライバシー）",
    body: `本サービスはユーザーの個人情報を収集・保存・第三者提供しません。ニックネームおよびアプリの利用データはブラウザの localStorage にのみ保存されます。ブラウザのデータを削除することで、すべての情報をリセットできます。`,
  },
  {
    title: "第9条（規約の変更）",
    body: `運営は必要と判断した場合、本規約を予告なく変更できます。変更後の規約は本サービス内に掲載した時点で効力を生じ、引き続き本サービスを利用したユーザーは変更後の規約に同意したものとみなします。`,
  },
  {
    title: "第10条（準拠法・裁判管轄）",
    body: `本規約の解釈・適用は日本法に準拠します。本サービスに関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。`,
  },
];

export function Terms() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>
          <span className="text-[17px] font-semibold">利用規約</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        {/* Hero */}
        <div className="flex flex-col items-center text-center pt-4 pb-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-[14px] mb-4 shadow-sm">
            <MessageSquare className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-[28px] font-bold tracking-tight mb-2">
            Duel 利用規約
          </h1>
          <p className="text-[15px] text-muted-foreground">
            最終更新日：2026年6月23日
          </p>
        </div>

        {/* Intro card */}
        <div className="bg-primary/8 rounded-[16px] px-5 py-4">
          <p className="text-[15px] leading-relaxed text-foreground/80">
            本サービスをご利用の前に、以下の利用規約をよくお読みください。本サービスにアクセス・利用することで、本規約に同意したものとみなされます。
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="bg-card rounded-[16px] px-5 py-5"
              style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
            >
              <h2 className="text-[17px] font-semibold mb-3 text-foreground">
                {section.title}
              </h2>
              {section.body && (
                <p className="text-[15px] leading-relaxed text-foreground/75">
                  {section.body}
                </p>
              )}
              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px] text-foreground/75 leading-relaxed">
                      <span className="mt-[3px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center pt-4">
          <p className="text-[13px] text-muted-foreground">
            ご不明な点は通報機能または運営管理画面よりお問い合わせください
          </p>
          <Link
            to="/"
            className="inline-block mt-4 text-[15px] font-medium text-primary"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
