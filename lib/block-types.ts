export type BlockType = 'text' | 'heading' | 'image' | 'quote' | 'list' | 'divider';

export interface ContentBlock {
  id: string;
  type: BlockType;
  order: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content: any;
}

export interface TextBlock extends ContentBlock {
  type: 'text';
  content: {
    text: string;
    style: {
      fontSize: number;
      fontWeight: 'normal' | 'bold';
      fontStyle: 'normal' | 'italic';
      textAlign: 'left' | 'center' | 'right';
      color: string;
      lineHeight: number;
    };
  };
}

export interface HeadingBlock extends ContentBlock {
  type: 'heading';
  content: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    style: {
      textAlign: 'left' | 'center' | 'right';
      color: string;
    };
  };
}

export interface ImageBlock extends ContentBlock {
  type: 'image';
  content: {
    src: string;
    alt: string;
    caption?: string;
    style: {
      objectFit: 'cover' | 'contain' | 'fill';
      borderRadius: number;
    };
  };
}

export interface QuoteBlock extends ContentBlock {
  type: 'quote';
  content: {
    text: string;
    author?: string;
    style: {
      textAlign: 'left' | 'center' | 'right';
      color: string;
      borderColor: string;
    };
  };
}

export interface ListBlock extends ContentBlock {
  type: 'list';
  content: {
    items: string[];
    ordered: boolean;
    style: {
      color: string;
    };
  };
}

export interface DividerBlock extends ContentBlock {
  type: 'divider';
  content: {
    style: {
      color: string;
      thickness: number;
    };
  };
}

export type AnyBlock = TextBlock | HeadingBlock | ImageBlock | QuoteBlock | ListBlock | DividerBlock;