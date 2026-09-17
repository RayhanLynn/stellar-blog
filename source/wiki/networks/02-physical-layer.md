---
title: 第二章 · 物理层
layout: page
wiki: networks
menu_id: wiki
banner: /assets/snow-mountain-lake.jpg
---

>The Physical Layer

Summary:考试范围
2.1 数据通信的理论基础（bandwidth、尼奎斯特定理，香农定理）
2.2 有导向的传输介质
2.6  PSTN电话系统（Modem的调制方式（调幅；调频）、ADSL、干线与复用（FDM；WDM；TDM）、电路交换、分组交换、三种交换方式的比较）

# 2.1 数据通信的理论基础
## 2.1.1 傅里叶分析
>不用算，知道用来干什么的就好

$$ g(t) = \frac{1}{2}c + \sum_{n=1}^{\infty} a_n \sin(2\pi n f t) + \sum_{n=1}^{\infty} b_n \cos(2\pi n f t) $$
意义：将离散信号和连续信号联系在一起

## 2.1.2 基本概念
**信道(channel)**：表示向<u>某一方向</u>发送信息的通道（信道≠通信线路），一条通信线路在逻辑上往往对应一条**发送信道**和一条**接收信道**

**速率**：连接到网络上的节点在信道上传输数据的速率，也称数据率或比特率、**数据传输速率**
- 单位
	- 比特率：bit/s = b/s = **bps**(bit per second)
		- B/s(1B=8b B=Byte 字节 b=bit比特)![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704135456.png)
	- 波特率：每秒传输几个码元
		- 码元/秒或波特(Baud)
	- 若一个码元携带n比特的信息量，则波特率M Baud对应的比特率为Mn b/s

**带宽(bandwidth)**：某信道所能传送的**最高数据率**/一个信道的最大数据速率
- 单位：bps(b/s、bit/s，可加数量前缀K、M、G、T)
- 在《通信原理》：表示信道允许通过的**信号频带范围**
	- 单位:Hz 可加数量前缀K、M、G、T
- 信道带宽越大，传输数据的能力越强
**节点间通信实际能达到的最高速率，由带宽、节点性能共同限制**

补充概念：
信源、信宿、信号、信道
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704141807.png)
码元：每一个信号就是一个码元
- 一个码元携带的比特数据：1码元=$\log_2 K \ \text{bit}$
	- K：一个周期内可能出现K种信号

## 2.1.3 信道的最大数据速率
>信道的极限容量

噪声：对信道产生干扰，影响信道的数据传输速率

**尼奎斯特定理** Henry Nyquist  Theorem：
适用条件：<u>理想低通信道</u>
- 一个**有限带宽**、**无噪声**信道的最大数据传输速率
若被传信号为V级，则尼奎斯特定理限定的最大数据传输率：
$$\text{Max data rate} = 2B\log_2 V \quad \text{bits/sec}$$
其中B：信道的频率带宽（单位：Hz）

**香农定理**Shannon theorem：
- 适用条件：一个**有噪声**（热动力引起）、**带宽有限**的信道
在带宽为B的有噪音信道中，信噪比为S/N，则信道的最大数据传输率：
$$\text{Max data rate} = B\log_2\left(1+\frac{S}{N}\right) \quad \text{bits/sec}$$
其中：
- B：信道的频率带宽（单位：Hz）
- S/N：信噪比（S：signal N：noise）$\frac{信号的功率}{噪声的功率}$
	- 信噪比越高，噪声对数据传输的影响越小
	- （1）无单位的比值<原公式的含义>
	- （2）以dB(分贝)为单位表示信噪比
		- 信噪比=$10\log_{10} S/N$
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704144719.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">
		
# 引导性传输介质
>Guided Transmission Data
>信号朝固定方向传播/有线介质

## 磁介质 Magnetic Media 
将数据从一台机器传输到另一台机器的最常见方法：将数据写到磁带或其他可擦写介质上，然后用物理方法将磁带或者磁盘运送到目标机器，再将数据从磁带或磁盘中读出来
特点：具有良好的带宽特性，但其延迟性却很差

## 双绞线 Twisted Pair
主要构成：两根互相绝缘的铜线相互绞合而成
- 双绞的作用：当两根线绞在一起后，**不同电线产生的干扰波会互相抵消**（<u>降低两条线间电磁干</u>扰），从而显著降低电线的辐射
- 有屏蔽层=屏蔽双绞线STP
	- 在每对双绞线外面加一个屏蔽层，然后整个线缆外面再加一个屏蔽层
- 没有屏蔽层=非屏蔽双绞线UTP(Unshielded Twisted Pair)
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704151403.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">
抗干扰能力：较好 
- 绞合、屏蔽层可以**提升电磁抗干扰能力**
	- 抗电磁干扰能力强➡️信道噪声功率低➡️信道极限速率升高
代表应用：近些年的局域网、早期的电话线

## 同轴电缆 Coaxial Cable
主要构成：**内导体**（用于传输信号）+**外导体屏蔽层**（抗电磁干扰）![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704152230.png)
- 内导体越粗，电阻越低，传输过程中信号衰减越少，传输距离越长
抗干扰能力：好 屏蔽层带来良好的抗干扰性
- 比UTP具有更好的屏蔽特性和更大的带宽，能以很高的速率传输相当长的距离   
代表应用：早期局域网、早期有线电视

## 光纤 Fiber Optics 
**主要构成**：纤芯（高折射率）+包层（低折射率）
- 利用光的全反射特性，在纤芯内传输光脉冲信号
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704153007.png" alt="image.png" style="max-width:375px;width:100%;height:auto;">
**光纤传输三要素**
- Light Source 光源：LED 和Laser 激光
- Transmission medium 传输介质: 光纤
- Detector 检测器： 光电二极管

分类：
- **多模光纤**<传输多路光信号>：纤芯更粗，可同时传输多条光线，不同的光束以不同的角度来回反射着向前传播，信号传输损耗更高，适合近距离传输
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704153319.png" alt="image.png" style="max-width:300px;width:100%;height:auto;">
- **单模光纤**<传输单路光信号>：纤芯更细，直径小于一个波长，光只能按直线传播而不会反射，只能传输一个波长，信号传输损耗低，适合远距离传输
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704153337.png" alt="image.png" style="max-width:300px;width:100%;height:auto;">

优点：
- 抗干扰能力：非常好 光信号对电磁干扰不敏感
- 信号传输损耗小，长距离传输时中继器少
- 很细很省布线空间

**光纤和铜线的比较**：
光纤的优点：
- 光纤比铜线能够处理更高的带宽
- 光纤具有相对较低的衰减，在较长的线路上需要中继器的数量少，节约了网络成本
- 光纤抗干扰能力强
- 光纤细小且重量较轻
- 光纤安装费用相对较低
- 光纤具有很高的安全性
- 几乎无限的带宽（不受Nyquist 和Shannon定理的限制）

光纤的缺点：
- 技术陌生，要求较高的操作技能
- 容易损坏
- 全双工或半双工，取决于两端的接口设备
- 光纤接口的成本远远高于电子接口的成本

# 2.6 公共电话交换网络
>PSTN (Public Switched Telephone Network,公用电话交换网)

## 2.6.1 电话系统结构
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704155943.png" alt="image.png" style="max-width:375px;width:100%;height:auto;">
- (a)全连接网络：将每部电话与其他电话实行全连接的模式
- (b)中心交换网络：路径简单，对中心节点高度依赖
- (c)两层体系结构

一个长途呼叫的典型电路路由：
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704160449.png)
图中一些概念的解释：
- Toll office(长途局)：每个端局都有一些出境线路连到一个或者多个附近的交换中心，这些交换中心称为长途局
- Tandem office(汇接局)：如果这些**交换中心**/长途局位于同一个本地地区内，用于本地端局之间的汇接转接，则称为汇接局
- Toll connecting trunk(长途连接干线)：出境线路的总称
现在所有的中继线和交换设备之间都是数字的，只有本地回路仍是模拟的
- 原因：数字传输无需像模拟传输那样经过一系列放大器之后必须精确还原出模拟波，而是只需要接收方能够正确区分比特0和比特1，这种特性使得数字传输比模拟传输更加可靠，而且系统的维护工作更容易，维护成本更便宜

电话系统的组成：**本地回路、干线、交换局**
- 本地回路：每个电话客户的电话机与端局end office之间的双线连接/进入家庭和公司的模拟双绞线
- 中继线/干线：连接交换局的数字光纤
- 交换局：电话呼叫在这里，从一条中继线被接入到另一条中继线

## 2.6.3 本地回路：调制解调器、ADSL和光纤
>The Local Loop: Modems, ADSL, and Wireless

本地回路常被称为：最后一英里

### 电话调制解调器
要在本地回路或任何其他物理信道上发送比特，必须把比特转化成可在信道上传输的模拟信号

调制解调器Modem：执行数字比特流和模拟信号流之间转换的设备
- 调制器modulator
- 解调器demodulator
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704163414.png)
Modem调制解调器 :数字信号➡️模拟信号
Codec 编码解码器: 模拟信号➡️数字信号
计算机-(M)-模拟-编码解码器-数字(干线)-编码解码器-模拟-(M)-计算机

![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704165000.png)
去掉本地回路中的一条，提高信噪比
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704165147.png)
the reason for choosing this speed（56kbps）
- Telephone channel is 4000Hz wide
- 重构信号所需要的采样次数至少8000 samples/sec（尼奎斯特定理如果要完整重构一个最高频率为 f 的信号，采样频率至少要达到 2f）
- 每个样本值8bit：8 bits/sample (7 data + 1 control)
- $7 bit*8000 = 56kbps$


### ADSL
>Digital Subscriber Lines数字用户线路
>Asymmetric DSL 非对称数字用户线路

![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704170200.png)
使用本地回路的所有1.1MHz频谱
频谱被分成256条独立信道
- 信道0：简单老式电话服务POTS (Plain Old Telephone Service)
- 信道1~5：空闲 防止语音信号与数据信号相互干扰
- 剩下的250条信道中，一条用于上行流控制，另一条用于下行流控制，其他的信道全部用于用户数据
**为什么80%~90%的带宽分配给下行信道（非对称）**
- 大多数用户的下载数据量远超于上传数据量

## 2.6.4 中继线和多路复用
### 频分复用 FDM
>FDM: Frequency Division Multiplexing         

定义：利用通道传输的优势使多个用户共享一个信道，它将频谱分成几个频段，每个用户完全拥有其中的一个频段来发送自己的信号
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704180907.png)
滤波器将每个语音级信道限制成大约3100Hz的可用带宽，当多个信道被复用在一起，为每个信道分配4000Hz带宽，语音通信所需多出来的那部分频带称为**保护带**，它使信道完全隔离

采用频分多路复用，首先将每个语音信道的频率得到不同程度的提升，然后把它们合并在一起
- 之所以能混合多个信道，是因为现在没有两个信道占据相同的频谱


### 波分复用 WDM
>WDM: Wave Division Multiplexing 

光纤WDM的基本原理：4条光纤汇合到一个光纤组合器（combiner）上，每条光纤的能量处于不同的波长处。四束光波被组合到一条共享的光纤上，然后传输给远处的接收方，在远端，这束光又被分离到与输入端一样多的光纤上
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704182112.png)
波分---波长不同，多模---入射角不同
WDM 可以看成极高频的FDM
- 波分复用就是光的频分复用
 密集波分多路复用（DWDM，Dense WDM）：信道的数目很大，并且波长的间隔非常接近
 
### 时分复用 TDM
>TDM: Time Division Multiplexing

时分多路复用是将信道用于传输的时间划分为若干个时间片
- 每个用户分得一个时间片
- 在其占有的时间片内，用户使用通信信道的全部带宽
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704183521.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704184053.png)
## 2.6.5 交换
### 电路交换
>Circuit Switching

定义：通过物理线路的连接，动态地分配传输线路资源
电路交换的过程：
- 建立通信（尝试占用通信资源）
- 通信（一直占用通信资源）
- 释放连接（归还通信资源）
一旦一个呼叫被建立起来，在两端之间就会存在一条专用路径，并且这条路径会一直持续该次呼叫结束
重要特点：发送数据之前需要建立一条端到端的路径
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704185607.png)
优缺点：
- 优点
	- 通信前建立一条端到端的专用物理通路，在通信的全部时间内，两个用户**始终占用**端到端的线路资源。数据直送，传输速率高
- 缺点
	- 建立/释放连接，需要额外的事件开销
	- 线路被通信双方独占，利用率低
	- 线路分配的灵活性差
	- 交换节点不支持差错控制，无法发现传输过程中发生的数据错误
适用于：**低频次、大量地传输数据**

### 报文交换
**存储转发**的思想：把传送的数据单元先存储进中间节点，再根据目的地址转发至下一节点
数据包交换中，没有固定的路径，不同的数据包可以走不同的路径，路径的选择取决于它们被传输时的网络状况，所以它们到达接收端的秩序可能出现混乱
优缺点
- 优点
	- 通信前无需建立连接
	- 数据以**报文**为单位被交换节点间存储转发，通信节点可以灵活分配
	- 在通信时间内，两个用户无需独占一整条物理线路。相比于电路交换，线路利用率高
	- 交换节点支持差错控制（通过校验技术）
- 缺点
	- 报文不定长，不方便存储转发管理
	- 长报文的存储转发时间开销大、缓存开销大
	- 长报文容易出错，重传代价高

### 分组交换
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704191836.png)
优缺点：
- 优点
	- 通信前无需建立连接
	- 数据以**分组**为单位被交换节点间存储转发，通信节点可以灵活分配
	- 在通信时间内，两个用户无需独占一整条物理线路。相比于电路交换，线路利用率高
	- 交换节点支持差错控制（通过校验技术）
相比于报文交换的改进：
- 分组定长，方便存储转发管理
- 分组的存储转发时间开销小、缓存开销小
- 分组不易出错，重传代价低

- 缺点
	- 相比于报文交换，控制信息占比增加
	- 相比于电路交换，依然存在存储转发时延
	- 报文被拆分成多个分组，传输过程中出现失序、丢失等问题，增加处理的复杂度
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260704192507.png)
dd
