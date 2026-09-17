---
title: 微操作命令的分析
layout: page
wiki: computer-organization
menu_id: wiki
banner: /assets/snow-mountain-lake.jpg
---

控制单元具有发出各种微操作命令（控制信号）序列的功能
为了便于讨论，假设CPU内有4个寄存器
MAR：MAR与地址总线相连，存放欲访问的存储单元的地址
MDR：MDR与数据总线相连，存放欲写入存储器的信息或最近从存储器中读出的信息
PC：存放现行指令地址，有计数功能
IR：存放现行指令
# 取指周期
取指令的过程可归纳为以下几个操作：
- 现行指令地址送至存储器地址寄存器
PC → MAR
- 向主存发送读命令，启动主存做读操作
1 → R
- 将MAR（通过地址总线）所指的主存单元中的内容（指令）经数据总线读至MDR
M(MAR) → MDR
- 将MDR中的内容送至IR
MDR → IR
- 指令的操作码送至CU译码
OP(IR) → CU/OP(IR) → CU(ID)
- 形成下一条指令的地址
PC+1 → PC
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229131326.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">

# 间址周期
间址周期完成取操作数有效地址的任务
- 将指令的地址码部分（形式地址）送至存储器地址寄存器
Ad(IR) → MAR
- 向主存发送读命令，启动主存做读操作
1 → R
- 将MAR（通过地址总线）所指的主存单元中的内容（有效地址）经数据总线读至MDR
M(MAR) → MDR
- 将有效地址送至指令寄存器的地址字段
MDR → Ad(IR)
(替换指令实际地址，很多机器并不需要)

# 执行周期
## 非访存指令
在执行周期不访问存储器
1. 清除累加器指令CLA
该指令在执行阶段只完成清除累加器操作
0 → ACC
2. 累加器取反指令COM
该指令在执行阶段只完成累加器内容取反，结果送累加器操作
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229132833.png" alt="image.png" style="max-width:51px;width:100%;height:auto;">
3. 算术右移一位指令SHR
该指令在执行阶段只完成累加器内容算术右移一位的操作
L(ACC) → R(ACC)
ACC0 → ACC0（ACC的符号位不变）
4. 循环左移一位指令CSL
该指令在执行阶段只完成累加器内容循环左移一位的操作
R(ACC) → L(ACC),
ACC0 → ACCn **ACC 的最低位（ACC₀）移动到最高位（ACCₙ）的位置**
5. 停机指令STP
计算机中有一个运行标志触发器G，当G=1时，表示机器运行，当G=0时表示停机
STP指令在执行阶段只需要将运行标志触发器置“0”
0 → G

## 访存指令
这类指令在执行阶段都需要访问存储器
方便起见，只考虑直接寻址的情况
1. 加法指令 ADD X
完成操作：累加器内容与对应于主存X地址单元的内容相加，结果送累加器
- 将指令的地址码部分送至存储器地址寄存器 Ad(IR) → MAR
- 向主存发送读命令，启动主存做读操作 1 → R
- 将MAR（通过地址总线）所指的主存单元中的内容（操作数）经数据总线读至MDR内 M(MAR) → MDR
- 给ALU发送加命令，将ACC的内容和MDR的内容相加，结果存于ACC (ACC)+(MDR) → ACC
有的加法指令**指定两个寄存器的内容相加** ADD AX,BX
该指令在执行阶段无须访存，只需完成 （AX）+（BX）→ AX
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229135600.png" alt="image.png" style="max-width:300px;width:100%;height:auto;">

2. 存数指令 STA X
完成操作：在执行阶段需要将累加器ACC的内容存于主存的X地址单元
- 将指令的地址码部分送至存储器地址寄存器 Ad(IR) → MAR
- 向主存发写命令，启动主存做写操作  1 → W
- 将累加器内容送至MDR ACC → MDR
- 将MDR中的内容（通过数据总线）写入MAR（通过地址总线）所指的主存单元中 MDR → M(MAR)
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229135532.png" alt="image.png" style="max-width:325px;width:100%;height:auto;">

3. 取数指令 LDA X
完成操作：该指令在执行阶段需要将主存X地址单元的内容取至累加器ACC中
- 将指令的地址码部分送至存储器地址寄存器 Ad(IR) → MAR
- 向主存发送读命令，启动主存做读操作 1 → R
- 将MAR（通过地址总线）所指的主存单元中的内容（操作数）经数据总线读至MDR内 M(MAR) → MDR
- 将MDR中的内容送至ACC MDR → ACC

## 转移类指令
这类指令在执行阶段也不访问存储器
1. 无条件转移指令 JMP X
完成操作：在执行阶段将指令的地址码部分X送至PC
Ad(IR) → PC
2. 条件转移指令（负则转） BAN X
完成操作：该指令根据上一条指令运行结果决定下一条指令的地址，若结果为负（累加器最高位为1，A0=1),则指令的地址码送至PC，否则程序按照原顺序执行
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229140639.png)

# 中断周期
在执行周期结束时刻，CPU要查询是否有请求中断的事件发生，如果有则进入中断周期
1. 假设程序断点存在主存的0地址单元，且采用硬件向量法寻找入口地址
- 将特定地址“0”送至存储器地址寄存器 0 → MAR
- 向主存发写命令，启动存储器作写操作 1 → W
- 将PC的内容（程序断点）送至MDR PC → MDR
- 将MDR中的内容（程序断点）通过数据总线写入MAR（通过地址总线）所指示的主存单元（0地址单元） MDR → M(MAR)
- 将向量地址形成部件输出送至PC，为下一条指令的取指周期做准备 向量地址 → PC
- 关中断，将允许中断触发器清零 0 → EINT
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229141854.png" alt="image.png" style="max-width:275px;width:100%;height:auto;">

2. 程序断点入栈
进栈操作：先修改指针，后存入数据
- 将入栈后存入断点的地址送至存储器地址寄存器 (SP)-1 → MAR
- 向主存发写命令，启动存储器作写操作 1 → W
- 将PC的内容（程序断点）送至MDR PC → MDR
- 将MDR中的内容（程序断点）通过数据总线写入MAR（通过地址总线）所指示的主存单元（0地址单元） MDR → M(MAR)
- 将向量地址形成部件输出送至PC，为下一条指令的取指周期做准备 向量地址 → PC
- 关中断，将允许中断触发器清零 0 → EINT
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229141936.png" alt="image.png" style="max-width:275px;width:100%;height:auto;">
