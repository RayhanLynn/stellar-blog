---
title: 主存储器
layout: page
wiki: computer-organization
menu_id: wiki
banner: /assets/snow-mountain-lake.jpg
---

# 概述
>主存是机器指令直接操作的存储器，需要基于主存地址对其进行随机访问
## 主存的基本组成
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102124249.png)
- **MAR（存储器地址寄存器）**：接收来自**地址总线**的地址信息，用于确定要访问的存储单元位置。
- **译码器**：对 MAR 中的地址进行译码，将其转换为存储体中具体存储单元的选择信号。
- **驱动器**：放大译码后的信号，驱动存储体中对应的存储单元，使其处于可访问状态。
- **存储体**：是存储器的核心，由大量存储单元组成，用于存放指令和数据。
- **读写电路**：在**控制电路**的 “读” 或 “写” 命令控制下，完成对存储体中数据的读取或写入操作。
- **MDR（存储器数据寄存器）**：是数据的暂存部件，读取时暂存从存储体中读出的数据，写入时暂存要写入存储体的数据；同时通过**数据总线**与 CPU 或其他部件进行数据交换。
- **控制电路**：接收 “读”“写” 控制信号，协调上述各部件的工作，保证读写操作的有序进行。

*图中译码器、驱动器、读写电路均制作在存储芯片中*
*MAR、MDR制作在CPU芯片内*
*存储芯片和CPU芯片可通过总线连接*
### 补充+个人理解
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102191301.png)
存储字：每个存储单元可存储一串二进制信息，这串二进制信息为一个存储字
存储字长：二进制信息的位数
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102191638.png)
非常清晰的阐明了MAR\MDR的作用以及对应代表的意义
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102192105.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102211238.png)

### 主存和CPU的联系
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102124814.png)
- 当要从存储器中读出某一信息字时，首先由CPU将该字的地址送至MAR，经地址总线送至主存，然后发出读命令。主存接到读的命令后，得知需将该地址单元的内容读出，便完成读操作，将该单元的内容读至数据总线上
	- ![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102211502.png)

- 若要向主存存入一个信息字时，首先CPU将该字所在主存单元的地址经MAR送到地址总线，并将信息字送入MDR，然后向主存发出命令，主存接到命令后，便将数据线上的信息写入对应地址线指出的主存单元中
	- ![e3cd7d7d089eaa1ce3415ccaffdf2b22.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/e3cd7d7d089eaa1ce3415ccaffdf2b22.png)
summary：
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251109094357.png)




## 🔆主存中存储单元地址的分配
### 补充知识
机器字长：CPU一次能够处理的二进制数据位数
存储字长：主存中一个存储单元所能存储的二进制位数
机器字长与存储字长不一定相同

- 主存通常按字节进行编址，而存储地址时字节的2的整数次幂倍
- 以机器字长为32位的计算机为例，对主存的访问既可以按字节访问，也可按16位半字访问，还可按32位字访问
	- 字节地址---主存按字节编址的字节地址
	- 半字地址
	- 字地址
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102134514.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102174245.png)

### 小端法 vs 大端法
大端法：高位字节排放在内存的低地址端
小端法：低位字节排放在内存的低地址端
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102174918.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102175451.png)

## 主存的技术指标
- 存储容量
	- 主存能存放二进制代码的总位数
	- 存储容量=存储单元个数x存储字长=存储单元个数x存储字长/8
- 存储速度
	- 存取时间/存储器的访问时间
		- 启动一次存储器操作开始到完成该操作所需的全部时间（从本次读/写开始至本次读/写结束）
		- 读出时间：从存储器接收到有效地址开始，到产生有效输出所需的全部时间
		- 写入时间：从存储器接收到有效地址开始，到数据写入被选中单元为止所需的全部时间
	- 存取周期
		- 存储器进行连续两次独立的存储器操作所需的最小间隔时间
- 存储器的带宽
	- 单位时间内存存取的信息量（存取信息量/时间）

# 半导体存储芯片简介
## 基本结构
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102183353.png)
- 译码驱动把地址总线送来的地址信号翻译成对应存储单元的选择信号，该信号在读/写电路的配合下完成对被选中单元的读/写操作
- 读/写电路包括读出放大器和写入电路，用来完成读/写操作
- 存储芯片通过地址总线、数据总线和控制总线与外部连接
- 地址线是单向输入，其位数与芯片容量相关
- 数据线是双向的，其位数与芯片可读出或写入的数据位数有关，数据线的位数与芯片容量相关
>✔️地址线与数据线共同反映存储芯片的容量（会计算芯片容量）
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102184205.png)
- 控制线
	- 读/写控制线
		- 决定芯片进行读/写操作
		- 半双工：$\overline{WE}$（低电平写，高电平读）
		- 全双工：$\overline{OE}$（允许读）$\overline{WE}$ (允许写)
	- 片选线
		- 选择存储芯片（由于半导体存储器由许多芯片组成，为此需要用片选信号来确定哪个芯片被选中）
		- ![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102185127.png)
## 译码驱动方式
- 线选法/单重译码
	- 特点：用一根字选择线，直接选中一个存储单元的各位
	- 结构相对简单，但只适用于容量不大的存储芯片
	- 通过一下两幅图片进行深入理解：
		- 来自湖科大教书匠![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102213002.png)
		- 来自课件![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102213109.png)

- 重合法/双重译码
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102213451.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102215039.png)

# 随机存取存储器（RAM）
## 分类
- 静态随机存取存储器---利用**双稳态触发器**存储信息
	- 速度快
	- 非破坏性读出
	- 常用于高速缓存
- 动态随机存取存储器---依靠电容上存储电荷来存储信息
	- 集成度最高
	- 信息易失，需定时刷新内容
	- 常用作主存

## 静态RAM（SRAM）
>1.静态：这种RAM只要保持通电，其内部所存储的数据就可以保持不变，**而不需要进行周期性地刷新**
>注：一旦断电：SRAM内部存储的数据还是会消失的---属于**易失性存储器**
>2.目前，SRAM内部的存储元（存储一个二进制位的单元）一般采用多个金属-氧化物半导体场效应晶体管MOSFET来构建，简称为MOS管

说明：以下均为湖科大教书匠网课内容（为方便记录和加深理解，先看的网课再进行的书本+ppt学习）
### MOS管
1.MOS管在数字电路中可看作是一个开关（原理如下图所示）
![b410464abfccee125cdc3e68f16885ef.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/b410464abfccee125cdc3e68f16885ef.jpg)
2.ppt上的MOS管部分
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102232230.png)

### 存储元
>存储元是存储器中最小的存储单位，，用于存放一个二进制位bit，0/1
#### 构成和工作原理
- 上电后初始状态（行选通X和列选通Y都为无效信号）
![b650e6b599c10da4ff49254f034fe390.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/b650e6b599c10da4ff49254f034fe390.jpg)
- 读操作（行选通X和列选通Y都为有效信号）
![ac3ef36b32cbea989f711e63ee429f12.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/ac3ef36b32cbea989f711e63ee429f12.jpg)
- 写操作（行选通X和列选通Y都为有效信号）
![fe6060f1b57957a9e7c860e4a4daf05d.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/fe6060f1b57957a9e7c860e4a4daf05d.jpg)
- 信息的保持（行选通X和列选通Y都为无效信号）
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251102231538.png)
#### 特点
- **上电后初始状态随机**（存储元的存储内容随机）
- **只要不断电，信息一直保存，不需要刷新**
- 电源Vcc通过负载管T3、T4不断为工作管T1、T2提供电流，以保存信息，因此**功耗大**
- 使用**晶体管的数量多**，占用晶圆面积大，成本高，价格昂贵，不适合用于更高存储密度且低成本的应用，eg：内存
- **速度快**，常用于微处理器的cache

#### 存储元与存储阵列扩展（补充部分）
##### 存储元的扩展
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103095059.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103095611.png)
##### 存储阵列的扩展
>如何一次访问多个存储元
将多个存储阵列的行选通线并联、列选通线并联

![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103100113.png)

### SRAM存储器结构
#### 结构
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103100501.png)
解释为什么要用驱动器
![8a9645ad36eebd26f7e93fd967331cca.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/8a9645ad36eebd26f7e93fd967331cca.jpg)
![a07539b5ab8c00f0255177657cbe13a0.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/a07539b5ab8c00f0255177657cbe13a0.jpg)
#### 芯片示例---Intel2114
- 写入控制
注：三态门作用：控制I/O数据线的传输方向
![856a1fccdba10d796e6ffd4181c6841b.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/856a1fccdba10d796e6ffd4181c6841b.png)
- 读取控制
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103102707.png)

## 动态RAM（DRAM）
>为克服SRAM的缺点
>1.设法尽量减少MOS管，通过**引入存储电容暂存电荷的方式保存数据**
>2.目前在内存中较为常见的结构是**单MOS管和电容构成的DRAM存储元**(一定要会)

### 存储元
#### 组成及工作原理
>靠电容存储电荷的原理来寄存信息，若电容上有足够多的电荷表示存1，电容上无电荷表示存0
##### 三管式
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251104123557.png)
- 读出
	- 先对预充电管T4置一预充电信号，使读数据线达高电平VDD
	- 由读数据线打开T2
		- 若T1的极间电容Cg存有足够多的电荷，使T1导通，则因T1、T2导通接地，使读数据线降为零电平，读出0
		- 若T1的极间电容Cg没有存有足够多的电荷，则T1截止，读数据线为高电平不变，读出1
		- 总结：**由读数据线的高低电平可区分读1、0，只是原存储信息相反**![af17968d598e474945abd1b250609606.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/af17968d598e474945abd1b250609606.jpg)
- 写入
	- 将写入信号加到写数据线上
	- 由写选择线打开T3，这样Cg便能随输入信息充电（写1），或者放电（写0）
*读出与原存信息（Cg 电平）相反*
*写入与原存信息（Cg 电平）相同*

##### 单管式
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251104125726.png)
读出
- 字线上的高电平使T导通
	- 若Cs有电荷，则经T管在数据线上产生电流，视为读出1
	- 若Cs无电荷，则经T管在数据线上不产生电流，视为读出0
写入
- 字线为高电平使T导通
	- 若数据线上为高电平，经T管对Cs充电，使其存1
	- 若数据线上为低电平，经Cs经T管放电，使其存0

读操作结束时，Cs的电荷已释放完毕，故是破坏性读出，必须再生
过程梳理：
当给MOS管的栅极输入高电平时，MOS管源极和漏极导通，给MOS管的源极输入高电平，电流通过MOS管给电容充电，直至充满
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103104004.png)
当取消给MOS管栅极输入的高电平时，MOS管截止，源极的电流被阻挡，电容保持充满电的状态---用电容充满电的状态表示二进制比特1
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103104211.png)
若现在MOS管被打开，而源极此时没有高电平输入来驱动电荷保持在电容上，则电容会通过MOS管放电，直到电容上的电荷完全放没---用电容完全没电的状态表示二进制比特0
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103104445.png)

上述**电容C放电过程，可看作是对存储元的读操作**，可发现，读操作使原本**存储的1读取后变成0**，为避免读操作导致的数据丢失，数据1读出后应将数据1重新写入---**数据恢复**

由于MOS管不可能完美关断，**电容C上的电荷会逐渐泄露**，数据1只能保存较短的时间，为避免数据丢失，必须定期采用类似读操作的方式对电容C补充电荷，称为**刷新**
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103104959.png)

#### DRAM存储元扩展
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103110613.png)
DRAM的读操作流程
- 预充电工作
	- 每一条列线都会被充电成DRAM供电电压Vcc的一半
- 访问操作
	- 停止预充电工作
		- 此时列线上的**寄生电容**会保持住此电压
		- 寄生电容：本来没有在此设计电容，但列线将一列中所有的MOS管连接到一起，因而具有较大的寄生电容，可以想象成每条列线上都接有一个电容（寄生电容远大于存储元上的电容）
	- 在读取的存储元所连接的行线输入有效信号，该行所有存储元中的MOS管导通
		- 对原本存储电容处于**满电状态**的存储元---**存储电容会向列线放电**
			- 存储电容上的电荷会减少，导致列线上的电压增加一点
		- 对原本存储电容处于未充电电状态的存储元---**存储电容会向列线充电**
			- 存储电容上的电荷从未充电状态增加电荷，导致列线上的电压减少一点
- 信号检测/灵敏读出放大器检测---判定待读取存储元所在行的每一个存储元所存储的一位二进制数据
- 数据恢复
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103111819.png)
- 数据输出
	- 给出列选通信号，可将列线上的数据输出到外部
	- 完成读操作后，撤除行选通信号，关闭
灵敏读出/恢复放大器

DRAM的写操作流程
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103112401.png)

### 刷新
#### 关于刷新的前提概要
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251104130703.png)

#### 几个概念
- 最大刷新周期：从数据存入DRAM开始，到数据丢失之前为止的这段时间
- 刷新周期：DRAM实际完成两次完整刷新之间的时间间隔
>由于存储单元被访问是随机的，有可能某些存储单元长期得不到访问，不进行存储器的读/写操作，其对存储单元内的原信息将会慢慢消失

刷新周期≤最大刷新周期
- 刷新存储元的数量：
	- DRAM按行进行刷新
	- 为了缩短刷新周期，可减少存储阵列的行数，增加列数
- 刷新与读操作的区别：
	- 刷新操作只需要给出行地址，而不需要给出列地址

#### 刷新方式
##### 集中刷新
定义：在规定的一个刷新周期内，对全部存储单元**集中一段时间逐行进行刷新**，此刻必须停止读/写操作
- 读写操作器件不受刷新操作的影响，这段时间的访问速度比较快
- 在集中刷新的时隙中，CPU长时间不能访问DRAM---“死区”时间
- 存储体包含的行数越多，“死区”时间就越长
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251104104855.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106103239.png)

##### 分散刷新
定义：对每行存储单元的刷新分散到每个存取周期内完成
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251104105221.png)
解释：把机器的存取周期（从一次到下一次访问内存的间隔时间）tc分成两段，前半段tm用于读/写/维持信息，后半段tr用于刷新
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106103532.png)

##### 异步刷新
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251104105253.png)
- 充分利用2ms时间，又保持系统高速特性，该方式缩短了死区时间（128个时隙缩短为1个时隙），效率更高---每隔一段时间一个死区时间
- 刷新一行只停止一个存取周期，但对于每行来说，刷新间隔时间仍为2ms，死时间缩短为0.5μs
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106104424.png)

## DRAM VS SRAM
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251103112644.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106104759.png)


# 只读存储器ROM
>ppt上内容极少，好像不太要求

定义：
- 只能从其读出信息，而不能随意写入信息的存储器，称为只读存储器
- 通过特定方式将信息写入ROM后，信息就固定在ROM中，即使电源断电，所保存的信息也不会丢失（ROM属于非易失性存储器）
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251104110840.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251104111137.png)


![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251104111554.png)
以下是对ppt内容的总结，也不是很多
```image-layout-a
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106105049.png" alt="image.png" style="max-width:475px;width:100%;height:auto;">
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106105212.png" alt="image.png" style="max-width:450px;width:100%;height:auto;">
```

<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106105143.png" alt="image.png" style="max-width:425px;width:100%;height:auto;">


# 🔆存储器与CPU的连接（重点！）
>由于单片存储芯片的容量总是有限的，很难满足实际的需要，因此必须将若干存储芯片连在一起才能组成足够容量的存储器

## 存储容量的扩展
### 位扩展
>数据总线扩展/字长扩展---增加存储字长

当**存储芯片的数据总线位宽小于CPU数据总线位宽**时，采用位扩展的方式进行扩展
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106111352.png)

对于上图中SRAM存储芯片的理解：
$256K={2^8}\times{2^{10}}=2^{18}$
$\overline{WE}$为写使能引脚，带有上划线代表低电平有效
低电平---写操作
高电平---读操作
$\overline{CS}$为片选引脚，低电平有效
>表明低电平有效的两种方式：#/上划线

对于CPU的理解：
A0-A17：共18个地址引脚，以便于存储芯片的18个地址引脚连接
R/W#：读写控制引脚，#代表低电平有效
- R：读控制信号高电平有效
- W：写控制信号低电平有效
- 可与存储芯片的写使能引脚连接
MREQ#：存储器控制引脚，低电平有效，可以与存储芯片的片选引脚连接

本例中CPU对主存的访问过程：
- 初始状态
CPU的存储器请求控制引脚MREQ，输出无效电平（高电平1）
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106112429.png)
- 初始状态下读操作
![e83b17c9f0cd7874434bda3e4bc79802.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/e83b17c9f0cd7874434bda3e4bc79802.jpg)
- 初始状态下写操作
1. CPU的数据总线送出32位待写入主存的数据
2. CPU的18位数据总线送出18位地址
3. 各存储芯片通过各自的18个地址引脚收到18位地址，当各存储芯片被同时选中工作时，其各自内部该地址所对应的存储单元被同时选中
4. 读写控制引脚输出低电平，各存储芯片的写使能引脚收到该低电平，此时各存储芯片此时未被选中工作
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106114331.png)

5. CPU的存储器请求控制引脚MREQ输出低电平，各存储芯片的CS收到低电平，因此被选中工作
6. 各存储芯片通过各自的一位数据线通过CPU的32位数据总线中相应的数据线上读出一位数据，并写入所选中的存储单元
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106114217.png)

- 将所有存储芯片的地址引脚、写使能引脚WE分别并联后再分别与CPU的地址引脚和读写控制引脚R/W相连
- 将各存储芯片的数据引脚依次与CPU的数据引脚及进行相应连接
- 将所有存储芯片的片选引脚CS并联后与CPU的存储器控制引脚MREQ相连

### 字扩展
>容量扩展/地址总线扩展---增加存储器字的数量

当**存储芯片的存储容量不能满足存储器对存储容量的需求**时，采用字扩展的方式进行扩展

分析：
地址总线位宽为21位：寻址空间$2^{21}=2\times2^{20}=2M$
存储芯片可寻址空间：$256K={2^8}\times{2^{10}}=2^{18}$

![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106115226.png)

字扩展的连接方式：
- 将CPU地址总线中A0-A17共18各地址引脚，连接到每一片存储芯片对应的18个地址引脚
- 剩余A18-A20分别连接到3-8译码器的3个译码输入引脚
- 3-8译码器的8个译码输出引脚分别连接到相应存储芯片的片选引脚CS
- CPU的存储器请求控制引脚连接到3-8译码器的输出使能引脚OE
- 将CPU的读写控制引脚连接到每一片存储芯片的写使能引脚WE
- 将CPU的8位数据总线连接到每一片存储芯片的8位数据总线
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106115933.png)

CPU对主存的访问过程
- 初始状态
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106120117.png)
- 读操作
	- CPU的21位地址总线送出21位地址，各存储芯片的18位地址引脚会通过各自的18个地址引脚收到21位地址的低18位
	- 3-8译码器的3个输入引脚收到高3位地址（假设000）
	- CPU的存储器请求控制引脚MREQ输出低电平，3-8译码器的输出使能引脚收到该低电平，将3位译码输入译码成8位译码输出
	- 8片存储芯片中只有一个的片选引脚收到有效电平，该存储芯片被选中工作
	- 该存储芯片通过自身18个地址引脚所收到18位地址所对应的存储芯片内部的存储单元被选中
	- 此时WE上信号来自之前R/W输出的高电平，该存储芯片将被选中的存储单元存储的8位数据通过8位数据总线传送到CPU的8位数据总线
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106121307.png)
- 写操作
	- CPU的8位数据总线送出8位待写入主存的数据
	- CPU的21位地址总线送出21位地址，其中各存储芯片通过各自的18个地址引脚收到21位地址的低18位，3-8译码器的地址输入引脚收到高三位地址（这里为方便举例说明假设111）
	- CPU的读/写控制引脚输出低电平，各存储芯片的WE收到该低电平，由于各存储芯片都未被选中工作，不会理会该信号
	- CPU的存储器请求控制引脚MREQ输出低电平，3-8译码器输出使能引脚OE收到该低电平时，将3位译码输入译码成8位输出
	- 8位存储芯片只有Y7对应的存储芯片的CS收到有效电平，该存储芯片被选中工作
	- 该存储芯片通过自身18个引脚收到的18位地址所对应的内部的存储单元被选中
	- 该存储芯片通过自身的8位数据总线从CPU的8位数据总线获取8位数据写入被选中的单元
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106122131.png)

基于本例的总结：
21位地址信息的高3位用来区分各存储芯片，用3位二进制数给各存储芯片进行编号000-111
21位地址信息的低18位区分各存储芯片自身内部的存储单元
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106122615.png)
- 将所有存储芯片的数据引脚、地址引脚、写使能引脚WE各自并联后再分别于CPU的数据引脚、地址引脚、读写控制引脚R/W连接
- 各存储芯片的片选引脚CS可由CPU多余的地址引脚同各国译码器产生

### 字、位扩展
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106133236.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106133246.png)

定义：当存储芯片的**数据位宽和存储容量均不能满足存储器的数据位宽和存储总容量要求**时，采用字位同时扩展
- 首先通过位扩展满足数据位宽的要求
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106133637.png)

- 再通过字扩展满足存储总容量的要求
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106133832.png)
- 主存与CPU的连接工作
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251106133917.png)
CPU对主存的访问过程与字扩展的读/写操作过程一致

## 存储器与CPU的连接
注意细节：
- 按字节编址---数据总线位数为8位
- CPU中MAR的位数，决定了主存的可寻址空间大小，进而决定了CPU所能支持的最大主存容量，而主存所使用的实际存储器的容量，应小于等于CPU所能支持的最大主存容量
- 存储空间分配：对于 RAM 区，先安排大容量芯片（放在地址低端），再安排小容量芯片
>若芯片的起始地址 A 是其容量 N 的整数倍，即 (A = k×N)（k 为整数，），则芯片的**地址范围**为 (`[k×N, (k+1)×N - 1]`)
- 当采用字扩展和采用位扩展所用芯片一样多时，选位扩展
- 若CPU中没有足够的高位地址线用来做译码器的使能端，则G1接Vcc

应用流程：
- 地址线的连接
	- CPU的地址线往往比存储芯片的地址管脚多
	- CPU地址线的低位与存储芯片的地址管脚相连
	- CPU地址线的高位通常用于提供片选信号
- 数据线的连接
	- CPU 的数据线同样比存储芯片的数据管脚多
	- 需把存储芯片的数据管脚分别连接在 CPU 的数据线上，完成位扩展
- 读/写命令线的连接
	- CPU 的读/写命令线一般可直接与存储芯片的读/写控制端相连
	- 有的CPU 读/写命令线是分开的
- 片选线的连接
	- 片选信号与 CPU 的访存控制信号 $\overline{MREQ }$有关
	- 未与存储芯片连接的CPU 高位地址需与$\overline{MREQ }$共同产生存储芯片的片选信号
	- 通常要借助译码器及其他门电路来产生片选
- 合理选择存储芯片的类型及数量
	- 存储芯片类型（RAM/ROM）+数量
	- 通常选用ROM存放系统程序、标准子程序和各类常数等
	- RAM则是为用户编程而设置的(系统程序工作区选择RAM)

做题步骤：
补充：十六进制的加减法——[十六进制的加、减、乘、除、左移、右移计算_十六进制加法-CSDN博客](https://blog.csdn.net/weixin_42108484/article/details/101380530)
![40d00042936299499d74fc21fc64a697.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/40d00042936299499d74fc21fc64a697.jpg)

# 存储器的校验
## 基本知识
- 编码最小距离：在一种编码系统中，任意两组合法代码之间二进制位数的最少差异
- 编码的纠错、检错能力与编码的最小距离有关
$$L-1=D+C（D≥C）$$
>L – 编码的最小距离
>D – 检查错误的位数（错 D 位以内可以被发现，并且超过 C 位时能发现不可纠）
 C – 纠正错误的位数（错 C 位以内可以被正确救回来）
>结论：编码最小距离L越大，则其检测错误的位数D越大，纠正错误的位数C也越大，且纠错能力恒小于等于检错能力

举例理解一下：

```image-layout-a
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251109142629.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251109142711.png)

```

## 汉明码
汉明码也是一种具有纠错能力的多重奇偶校验，**它将一个信息代码按一定规律分成若干组，每组配一个奇偶校验位**

编码方法
- 在位序是 2 的整数次幂的位置放置校验位，其他位置放置有效信息
- 每个分组按偶校验规则确定校验位的取值

### 组成
- n 位代码需增添 k 位检测位
>k个分组，代表2^k种情况
$$2^k \geqslant n + k + 1$$
- 检测位的位置 $2^i \qquad i∈{0,1,2···}$
- 检测数的取值
	- 检测位的取值与该位所在的检测“小组”中承担的奇偶校验任务有关![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251109143839.png)
举个例子理解一下：
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251109144822.png)
![ab693881a45497c93980eecf173ddc53.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/ab693881a45497c93980eecf173ddc53.jpg)
分组的小依据与C1一组的，其第一位均为1
与C2一组的，其第二位均为1
与C3一组的，其第二位均为1
（按照从右到左的顺序）
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251109151505.png)

### 校验方法
分别检查各分组中 1 的个数是否为偶数
- 当第i组中1的个数为偶数时，gi=0；否则gi=1
- 错误字G= (gr . . . g2g1) 指明是否出错以及错误位置
	- 当 G = 0 时，代码无错误
	- 当 G ≠ 0 时，代码有错，G 指明了出错位置
![a7abd634c950e56d55acfb9ed655aa84.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/a7abd634c950e56d55acfb9ed655aa84.jpg)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251109151956.png)
