
export enum LineDirection{
    left,
    right,
    none,
}
export interface AlphabetIconDisplayData{
    alphabet: string;   // 해당 알파벳이름
    normal: string; // normal이미지
    select: string; // 셀렉트 이미지
    disable: string; // disable 이미지
    x: number;      // x위치
    y: number;      // y위치
    lineDir: LineDirection;    // 점선라인 왼쪽에 있냐?

}

export const displayData: Array<AlphabetIconDisplayData> =[
    
    // Z
    {
        alphabet:"Z",
        normal: "img/alphabet/12_alphabet_z.png",
        select: "img/alphabet/12_alphabet_z_in.png",
        disable: "img/alphabet/12_alphabet_z_dis.png",
        x:140 + (300 *2 )+ (108)*25,
        y:150 + (200)*1,
        lineDir: LineDirection.left
    },
    // Y
    {
        alphabet:"Y",
        normal: "img/alphabet/12_alphabet_y.png",
        select: "img/alphabet/12_alphabet_y_in.png",
        disable: "img/alphabet/12_alphabet_y_dis.png",
        x:140 + (300 *2 )+ (108)*24,
        y:150 + (200)*0,
        lineDir: LineDirection.right
    },
    // X
    {
        alphabet:"X",
        normal: "img/alphabet/12_alphabet_x.png",
        select: "img/alphabet/12_alphabet_x_in.png",
        disable: "img/alphabet/12_alphabet_x_dis.png",
        x:140 + (300 *2 )+ (108)*23,
        y:150 + (200)*1,
        lineDir: LineDirection.right
    },
    // W
    {
        alphabet:"W",
        normal: "img/alphabet/12_alphabet_W.png",
        select: "img/alphabet/12_alphabet_w_in.png",
        disable: "img/alphabet/12_alphabet_w_dis.png",
        x:140 + (300 *2 )+ (108)*22,
        y:150 + (200)*2,
        lineDir: LineDirection.left
    },
    // V
    {
        alphabet:"V",
        normal: "img/alphabet/12_alphabet_v.png",
        select: "img/alphabet/12_alphabet_v_in.png",
        disable: "img/alphabet/12_alphabet_v_dis.png",
        x:140 + (300 *2 )+ (108)*21,
        y:150 + (200)*1,
        lineDir: LineDirection.left
    },
    // U
    {
        alphabet:"U",
        normal: "img/alphabet/12_alphabet_u.png",
        select: "img/alphabet/12_alphabet_u_in.png",
        disable: "img/alphabet/12_alphabet_u_dis.png",
        x:140 + (300 *2 )+ (108)*20,
        y:150 + (200)*0,
        lineDir: LineDirection.right
    },
    // T
    {
        alphabet:"T",
        normal: "img/alphabet/12_alphabet_t.png",
        select: "img/alphabet/12_alphabet_t_in.png",
        disable: "img/alphabet/12_alphabet_t_dis.png",
        x:140 + (300 *2 )+ (108)*19,
        y:150 + (200)*1,
        lineDir: LineDirection.right
    },
    // S
    {
        alphabet:"S",
        normal: "img/alphabet/12_alphabet_s.png",
        select: "img/alphabet/12_alphabet_s_in.png",
        disable: "img/alphabet/12_alphabet_s_dis.png",
        x:140 + (300 *2 )+ (108)*18,
        y:150 + (200)*2,
        lineDir: LineDirection.none
    },
    // R
    {
        alphabet:"R",
        normal: "img/alphabet/12_alphabet_r.png",
        select: "img/alphabet/12_alphabet_r_in.png",
        disable: "img/alphabet/12_alphabet_r_dis.png",
        x:140 + 300 + (108)*17,
        y:150 + (200)*1,
        lineDir: LineDirection.left
    },
    // Q
    {
        alphabet:"Q",
        normal: "img/alphabet/12_alphabet_q.png",
        select: "img/alphabet/12_alphabet_q_in.png",
        disable: "img/alphabet/12_alphabet_q_dis.png",
        x:140 + 300 + (108)*16,
        y:150 + (200)*0,
        lineDir: LineDirection.right
    },
    // P
    {
        alphabet:"P",
        normal: "img/alphabet/12_alphabet_p.png",
        select: "img/alphabet/12_alphabet_p_in.png",
        disable: "img/alphabet/12_alphabet_p_dis.png",
        x:140 + 300 + (108)*15,
        y:150 + (200)*1,
        lineDir: LineDirection.right
    },
    // O
    {
        alphabet:"O",
        normal: "img/alphabet/12_alphabet_o.png",
        select: "img/alphabet/12_alphabet_o_in.png",
        disable: "img/alphabet/12_alphabet_o_dis.png",
        x:140 + 300 + (108)*14,
        y:150 + (200)*2,
        lineDir: LineDirection.left
    },
    // N
    {
        alphabet:"N",
        normal: "img/alphabet/12_alphabet_n.png",
        select: "img/alphabet/12_alphabet_n_in.png",
        disable: "img/alphabet/12_alphabet_n_dis.png",
        x:140 + 300 + (108)*13,
        y:150 + (200)*1,
        lineDir: LineDirection.left
    },
    // M
    {
        alphabet:"M",
        normal: "img/alphabet/12_alphabet_m.png",
        select: "img/alphabet/12_alphabet_m_in.png",
        disable: "img/alphabet/12_alphabet_m_dis.png",
        x:140 + 300 + (108)*12,
        y:150 + (200)*0,
        lineDir: LineDirection.right
    },
    // L
    {
        alphabet:"L",
        normal: "img/alphabet/12_alphabet_l.png",
        select: "img/alphabet/12_alphabet_l_in.png",
        disable: "img/alphabet/12_alphabet_l_dis.png",
        x:140 + 300 + (108)*11,
        y:150 + (200)*1,
        lineDir: LineDirection.right
    },
    // K
    {
        alphabet:"K",
        normal: "img/alphabet/12_alphabet_k.png",
        select: "img/alphabet/12_alphabet_k_in.png",
        disable: "img/alphabet/12_alphabet_k_dis.png",
        x:140 + 300 + (108)*10,
        y:150 + (200)*2,
        lineDir: LineDirection.left
    },
    // J
    {
        alphabet:"J",
        normal: "img/alphabet/12_alphabet_j.png",
        select: "img/alphabet/12_alphabet_j_in.png",
        disable: "img/alphabet/12_alphabet_j_dis.png",
        x:140 + 300 + (108)*9,
        y:150 + (200)*1,
        lineDir: LineDirection.none
    },
    // I
    {
        alphabet:"I",
        normal: "img/alphabet/12_alphabet_i.png",
        select: "img/alphabet/12_alphabet_i_in.png",
        disable: "img/alphabet/12_alphabet_i_dis.png",
        x:140 + (108)*8,
        y:150 + (200)*0,
        lineDir: LineDirection.right
    },
    // H
    {
        alphabet:"H",
        normal: "img/alphabet/12_alphabet_h.png",
        select: "img/alphabet/12_alphabet_h_in.png",
        disable: "img/alphabet/12_alphabet_h_dis.png",
        x:140 + (108)*7,
        y:150 + (200)*1,
        lineDir: LineDirection.right
    },
    // G
    {
        alphabet:"G",
        normal: "img/alphabet/12_alphabet_g.png",
        select: "img/alphabet/12_alphabet_g_in.png",
        disable: "img/alphabet/12_alphabet_g_dis.png",
        x:140 + (108)*6,
        y:150 + (200)*2,
        lineDir: LineDirection.left
    },
    // F
    {
        alphabet:"F",
        normal: "img/alphabet/12_alphabet_f.png",
        select: "img/alphabet/12_alphabet_f_in.png",
        disable: "img/alphabet/12_alphabet_f_dis.png",
        x:140 + (108)*5,
        y:150 + (200)*1,
        lineDir: LineDirection.left
    },
    // E
    {
        alphabet:"E",
        normal: "img/alphabet/12_alphabet_e.png",
        select: "img/alphabet/12_alphabet_e_in.png",
        disable: "img/alphabet/12_alphabet_e_dis.png",
        x:140 + (108)*4,
        y:150 ,
        lineDir: LineDirection.right
    },
    // D
    {
        alphabet:"D",
        normal: "img/alphabet/12_alphabet_d.png",
        select: "img/alphabet/12_alphabet_d_in.png",
        disable: "img/alphabet/12_alphabet_d_dis.png",
        x:140 + (108)*3,
        y:150 + (200)*1,
        lineDir: LineDirection.right
    },
    // C
    {
        alphabet:"C",
        normal: "img/alphabet/12_alphabet_c.png",
        select: "img/alphabet/12_alphabet_c_in.png",
        disable: "img/alphabet/12_alphabet_c_dis.png",
        x:140 + (108)*2,
        y:150 + (200)*2,
        lineDir: LineDirection.left
    },
    // B
    {
        alphabet:"B",
        normal: "img/alphabet/12_alphabet_b.png",
        select: "img/alphabet/12_alphabet_b_in.png",
        disable: "img/alphabet/12_alphabet_b_dis.png",
        x:140 + (108),
        y:150 + (200),
        lineDir: LineDirection.left
    },
    // A
    {
        alphabet:"A",
        normal: "img/alphabet/12_alphabet_a.png",
        select: "img/alphabet/12_alphabet_a_in.png",
        disable: "img/alphabet/12_alphabet_a_dis.png",
        x:140,
        y:150,
        lineDir: LineDirection.none
    }
    // 세로형 ==>    가로형
    // left   ==>   up
    // right  ==>   down
]
