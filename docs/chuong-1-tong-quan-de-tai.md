# CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI

## 1.1. Tổng quan đề tài

### 1.1.1. Tên đề tài
Xây dựng hệ thống chatbot hỏi-đáp tài liệu (Document Question-Answering Chatbot) ứng dụng
kiến trúc RAG (Retrieval-Augmented Generation) ở dạng rút gọn, tự cài đặt.

### 1.1.2. Đặt vấn đề
Trong quá trình làm việc với tài liệu dài như hợp đồng, báo cáo kỹ thuật, hoặc giáo trình,
người dùng thường mất nhiều thời gian để tìm kiếm thông tin cụ thể, phải đọc lướt toàn bộ nội
dung hoặc tra cứu thủ công bằng công cụ tìm kiếm văn bản đơn thuần (Ctrl+F), vốn chỉ khớp từ
khóa chính xác và không xử lý được câu hỏi diễn đạt theo ngôn ngữ tự nhiên. Sự phát triển của
các mô hình ngôn ngữ lớn (Large Language Model) mở ra khả năng giải quyết vấn đề này thông qua
kiến trúc RAG, kỹ thuật giúp câu trả lời của mô hình bám sát vào một nguồn dữ liệu cụ thể do
người dùng cung cấp, thay vì chỉ dựa vào tri thức đã học sẵn của mô hình. Đây là hướng tiếp cận
được ứng dụng rộng rãi trong thực tế nhằm hạn chế hiện tượng mô hình sinh ra thông tin không
chính xác (hallucination). Đề tài được thực hiện nhằm xây dựng một hệ thống hoàn chỉnh theo
hướng tiếp cận trên, với trọng tâm là tự cài đặt các thành phần kỹ thuật cốt lõi (phân đoạn văn
bản, truy hồi thông tin liên quan) thay vì sử dụng framework có sẵn, nhằm đảm bảo người thực
hiện nắm vững và có khả năng lý giải bản chất của từng thành phần trong hệ thống.

### 1.1.3. Mục tiêu và phạm vi đề tài
Mục tiêu của đề tài là xây dựng một sản phẩm chạy được hoàn chỉnh, cho phép người dùng tải lên
tài liệu và đặt câu hỏi bằng ngôn ngữ tự nhiên, nhận về câu trả lời có trích dẫn nguồn gốc rõ
ràng từ tài liệu gốc. Đề tài được giới hạn ở quy mô một sản phẩm đơn người dùng, không xử lý
các yêu cầu về xác thực (authentication), phân quyền, hay lưu trữ dữ liệu dài hạn — những thành
phần này nằm ngoài phạm vi trọng tâm học thuật của đề tài.

## 1.2. Khảo sát các giải pháp

### 1.2.1. Nhóm giải pháp nền tảng dựng sẵn (no-code)
Đại diện tiêu biểu cho nhóm này là Chatbase, nền tảng cho phép người dùng tải tài liệu lên, kết
nối nguồn dữ liệu như Notion hoặc URL, và triển khai chatbot trong vài phút, với khả năng huấn
luyện chatbot bằng nhiều định dạng khác nhau: tệp văn bản, tài liệu Word, hoặc PDF. Ưu điểm của
nhóm giải pháp này là tốc độ triển khai, không yêu cầu kiến thức lập trình. Tuy nhiên, đây là
giải pháp dạng "hộp đen": người dùng không kiểm soát được cơ chế phân đoạn văn bản hay thuật
toán truy hồi bên trong, không phù hợp với mục tiêu học thuật của đề tài là hiểu và lý giải
được bản chất kỹ thuật.

### 1.2.2. Nhóm giải pháp framework mã nguồn mở
Đại diện tiêu biểu là LlamaIndex, framework dữ liệu mã nguồn mở dùng để xây dựng ứng dụng mô
hình ngôn ngữ lớn, hỗ trợ song song Python và TypeScript. Framework này hỗ trợ hơn 150
connector dữ liệu thông qua LlamaHub và cung cấp nhiều loại chỉ mục dữ liệu khác nhau, bao gồm
chỉ mục vector, chỉ mục tóm tắt và chỉ mục đồ thị tri thức. Về hạn chế, các đánh giá kỹ thuật
ghi nhận framework này có đường cong học tập tương đối dốc đối với các tính năng nâng cao;
việc suy luận đa tài liệu, vòng lặp agent và bộ truy hồi tùy chỉnh đòi hỏi hiểu biết chuyên sâu
về mô hình RAG. Đây là căn cứ quan trọng để đề tài quyết định không sử dụng framework này làm
nền tảng chính: việc dùng framework như một hộp đen sẽ lặp lại đúng hạn chế đã gặp ở đồ án
trước.

### 1.2.3. Căn cứ kỹ thuật cho quyết định phân đoạn (chunking) tự cài đặt
Việc lựa chọn kích thước đoạn văn bản (chunk size) khoảng 300–500 từ không phải là lựa chọn
tùy ý mà có căn cứ thực nghiệm. Theo kết quả tổng hợp benchmark từ Arize AI, kích thước đoạn
khoảng 300-500 token là mục tiêu phù hợp, việc tăng kích thước đoạn lớn hơn mức này cho kết
quả tiêu cực. Một nghiên cứu thực nghiệm khác trên tập dữ liệu benchmark cũng cho thấy việc
tăng kích thước đoạn từ 50 lên 500 giúp cải thiện độ chính xác nhờ cung cấp ngữ cảnh phong phú
hơn, nhưng khi kích thước đoạn đạt tới 1000, độ chính xác lại giảm do nội dung dư thừa làm
loãng mức độ liên quan. Kết quả khảo sát này là cơ sở trực tiếp cho quyết định kỹ thuật của đề
tài: chọn khoảng 300–500 từ mỗi đoạn, nằm trong vùng đã được chứng minh cho hiệu quả truy hồi
tốt, đồng thời đủ đơn giản để tự cài đặt và giải thích được.

### 1.2.4. Căn cứ cho việc lựa chọn kiến trúc RAG thay vì để mô hình tự trả lời
Việc bổ sung cơ chế truy hồi tài liệu trước khi sinh câu trả lời có căn cứ từ chính hạn chế đã
biết của mô hình ngôn ngữ lớn: RAG giúp giảm hiện tượng mô hình bịa thông tin và cho phép mô
hình trả lời các câu hỏi mà nếu không có RAG, mô hình sẽ không có khả năng trả lời, ví dụ các
câu hỏi liên quan đến dữ liệu nội bộ hoặc dữ liệu riêng tư của tổ chức. Đây chính là luận điểm
cốt lõi biện minh cho việc xây dựng toàn bộ pipeline RAG của đề tài, thay vì chỉ đơn thuần gọi
API mô hình ngôn ngữ lớn mà không có bước truy hồi.

### 1.2.5. Tổng hợp quyết định công nghệ

| Hạng mục | Giải pháp đã khảo sát | Dẫn chứng/căn cứ | Giải pháp lựa chọn |
|---|---|---|---|
| Kiến trúc hệ thống | Chatbase, LlamaIndex | Cần hiểu rõ bản chất kỹ thuật, tránh "hộp đen" | Tự cài đặt pipeline RAG rút gọn |
| Phân đoạn (Chunking) | Kích thước biến đổi | Thực nghiệm Arize AI (300-500 từ/đoạn) | 300-500 từ mỗi đoạn |

## 1.3. Xác định các tính năng cần xây dựng

### 1.3.1. Nguyên tắc thiết kế trải nghiệm người dùng
Hệ thống được thiết kế theo mô hình tương tác một luồng liên tục, người dùng cung cấp tài liệu
và đặt câu hỏi trong cùng một không gian làm việc, không tách thành các bước riêng biệt. Mô
hình tương tác này giúp giảm số bước thao tác cần thiết trước khi người dùng nhận được câu trả
lời đầu tiên.

### 1.3.2. Nhóm chức năng quản lý phiên làm việc
- Khởi tạo phiên làm việc mới, cho phép người dùng bắt đầu một bối cảnh hỏi-đáp độc lập.
- Duy trì và hiển thị danh sách các phiên làm việc đã thực hiện trong quá trình sử dụng.
- Lưu trữ và khôi phục lại nội dung hội thoại của một phiên làm việc khi người dùng quay lại.

### 1.3.3. Nhóm chức năng tiếp nhận và xử lý tài liệu
- Tiếp nhận tài liệu đầu vào ở định dạng phổ biến (PDF, docx, văn bản thuần).
- Trích xuất nội dung văn bản từ tài liệu đã tiếp nhận.
- Phân đoạn nội dung văn bản thành các đơn vị nhỏ hơn, làm cơ sở cho bước truy hồi thông tin.

### 1.3.4. Nhóm chức năng hỏi-đáp
- Tiếp nhận câu hỏi của người dùng dưới dạng ngôn ngữ tự nhiên.
- Truy hồi các đơn vị văn bản có liên quan nhất đến câu hỏi từ tài liệu đã xử lý.
- Sinh câu trả lời dựa trên nội dung đã truy hồi được, đảm bảo câu trả lời có căn cứ từ tài
  liệu gốc.
- Hiển thị nguồn trích dẫn, đoạn văn bản gốc đã được sử dụng để hình thành câu trả lời, nhằm
  cho phép người dùng tự kiểm chứng.
- Phản hồi trung thực khi không tìm thấy thông tin liên quan trong tài liệu, không suy diễn
  hoặc tạo ra thông tin không có căn cứ.

### 1.3.5. Tiêu chí chất lượng xuyên suốt
- Mỗi thành phần chức năng đảm nhiệm một nhiệm vụ rõ ràng, tách biệt, thuận tiện cho việc kiểm
  thử và trình bày độc lập.
- Tính trung thực của câu trả lời là tiêu chí ưu tiên hàng đầu, được đặt lên trên tính đầy đủ
  hay tính "mượt" của câu trả lời.
