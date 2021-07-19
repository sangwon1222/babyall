

// A~Z a~z의 사이즈와 배치 위치 정보

export interface ALLayoutData{
    w: number;       //박스의 width
    h: number;      //박스의 height
    px: number;      // 중심위치 X
    py: number;      // 중심위치 Y
}

const AlphabetLayoutData ={
    a:{ w:100, h:100, px:50, py:100 },
    b:{ w:100, h:100, px:50, py:100 },
    c:{ w:100, h:100, px:50, py:100 },
    d:{ w:100, h:100, px:50, py:100 },
    e:{ w:100, h:100, px:50, py:100 },
    f:{ w:100, h:100, px:50, py:100 },
    g:{ w:100, h:100, px:50, py:100 },
    h:{ w:100, h:100, px:50, py:100 },
    i:{ w:100, h:100, px:50, py:100 },
    j:{ w:100, h:100, px:50, py:100 },
    k:{ w:100, h:100, px:50, py:100 },
    l:{ w:100, h:100, px:50, py:100 },
    m:{ w:100, h:100, px:50, py:100 },
    n:{ w:100, h:100, px:50, py:100 },
    o:{ w:100, h:100, px:50, py:100 },
    p:{ w:100, h:100, px:50, py:100 },
    q:{ w:100, h:100, px:50, py:100 },
    r:{ w:100, h:100, px:50, py:100 },
    s:{ w:100, h:100, px:50, py:100 },
    t:{ w:100, h:100, px:50, py:100 },
    u:{ w:100, h:100, px:50, py:100 },
    v:{ w:100, h:100, px:50, py:100 },
    w:{ w:100, h:100, px:50, py:100 },
    x:{ w:100, h:100, px:50, py:100 },
    y:{ w:100, h:100, px:50, py:100 },
    z:{ w:100, h:100, px:50, py:100 },

    A:{ w:100, h:100, px:50, py:100 },
    B:{ w:100, h:100, px:50, py:100 },
    C:{ w:100, h:100, px:50, py:100 },
    D:{ w:100, h:100, px:50, py:100 },
    E:{ w:100, h:100, px:50, py:100 },
    F:{ w:100, h:100, px:50, py:100 },
    G:{ w:100, h:100, px:50, py:100 },
    H:{ w:100, h:100, px:50, py:100 },
    I:{ w:100, h:100, px:50, py:100 },
    J:{ w:100, h:100, px:50, py:100 },
    K:{ w:100, h:100, px:50, py:100 },
    L:{ w:100, h:100, px:50, py:100 },
    M:{ w:100, h:100, px:50, py:100 },
    N:{ w:100, h:100, px:50, py:100 },
    O:{ w:100, h:100, px:50, py:100 },
    P:{ w:100, h:100, px:50, py:100 },
    Q:{ w:100, h:100, px:50, py:100 },
    R:{ w:100, h:100, px:50, py:100 },
    S:{ w:100, h:100, px:50, py:100 },
    T:{ w:100, h:100, px:50, py:100 },
    U:{ w:100, h:100, px:50, py:100 },
    V:{ w:100, h:100, px:50, py:100 },
    W:{ w:100, h:100, px:50, py:100 },
    X:{ w:100, h:100, px:50, py:100 },
    Y:{ w:100, h:100, px:50, py:100 },
    Z:{ w:100, h:100, px:50, py:100 },

}

export interface QuizDataTypeBase{
    type: number;
    guide: string;
    lines: Array<string>;
    correct: Array<string>;
    wrong: Array<string>;
    picture: Array<string>;
    sound: string;
  }