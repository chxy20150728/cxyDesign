
$(document).ready(function() {
    // 初始化 Fabric Canvas
    const canvas = new fabric.Canvas('c', {
        backgroundColor: '#ffffff',
        selectionColor: 'rgba(0, 0, 255, 0.1)',
        selectionBorderColor: 'blue',
        selectionLineWidth: 2
    });

    // 响应式调整画布大小（可选，这里保持固定大小以简化演示）
    // function resizeCanvas() { ... }

    // --- 工具函数 ---

    // 添加矩形
    function addRect() {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: $('#color-picker').val(),
            width: 100,
            height: 100,
            opacity: parseFloat($('#opacity-slider').val())
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
    }

    // 添加圆形
    function addCircle() {
        const circle = new fabric.Circle({
            left: 150,
            top: 150,
            fill: $('#color-picker').val(),
            radius: 50,
            opacity: parseFloat($('#opacity-slider').val())
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
    }

    // 添加三角形
    function addTriangle() {
        const triangle = new fabric.Triangle({
            left: 200,
            top: 200,
            fill: $('#color-picker').val(),
            width: 100,
            height: 100,
            opacity: parseFloat($('#opacity-slider').val())
        });
        canvas.add(triangle);
        canvas.setActiveObject(triangle);
        canvas.renderAll();
    }

    // 添加文本
    function addText() {
        const text = new fabric.IText('Double click to edit', {
            left: 100,
            top: 100,
            fontFamily: 'Arial',
            fill: $('#color-picker').val(),
            fontSize: 24,
            opacity: parseFloat($('#opacity-slider').val())
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    }

    // --- 事件监听 ---

    // 形状按钮点击
    $('.tool-btn[data-shape]').on('click', function() {
        const shape = $(this).data('shape');
        if (shape === 'rect') addRect();
        else if (shape === 'circle') addCircle();
        else if (shape === 'triangle') addTriangle();
    });

    // 添加文本按钮
    $('#btn-add-text').on('click', function() {
        addText();
    });

    // 图片上传处理
    $('#img-upload').on('change', function(e) {
        const file = e.target.files;
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(f) {
            const data = f.target.result;
            fabric.Image.fromURL(data, function(img) {
                // 缩放图片以适应画布
                img.scaleToWidth(200);
                img.set({
                    left: 100,
                    top: 100,
                    opacity: parseFloat($('#opacity-slider').val())
                });
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
            });
        };
        reader.readAsDataURL(file);
        // 重置 input 以便可以再次选择同一文件
        $(this).val('');
    });

    // 颜色选择器改变
    $('#color-picker').on('input change', function() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            // 如果是文本或形状，改变 fill
            if (activeObject.type === 'i-text' || activeObject.type === 'text' || 
                activeObject.type === 'rect' || activeObject.type === 'circle' || 
                activeObject.type === 'triangle') {
                activeObject.set('fill', this.value);
            } 
            // 如果是图片，可以改变滤镜或其他属性，这里简单处理
            canvas.renderAll();
        }
    });

    // 透明度滑块改变
    $('#opacity-slider').on('input change', function() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('opacity', parseFloat(this.value));
            canvas.renderAll();
        }
    });

    // 删除选中对象
    $('#btn-delete').on('click', function() {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
            canvas.discardActiveObject();
            activeObjects.forEach(function(obj) {
                canvas.remove(obj);
            });
            canvas.renderAll();
        }
    });

    // 清空画布
    $('#btn-clear').on('click', function() {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
    });

    // 下载图片
    $('#btn-download').on('click', function() {
        // 取消选中状态，避免下载时包含选中框
        canvas.discardActiveObject();
        canvas.renderAll();
        
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        const link = document.createElement('a');
        link.download = 'fabric-design.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 键盘删除支持
    $(document).on('keydown', function(e) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            // 如果正在编辑文本，不删除对象
            const activeObject = canvas.getActiveObject();
            if (activeObject && !activeObject.isEditing) {
                $('#btn-delete').trigger('click');
            }
        }
    });

    // 初始提示
    console.log("Fabric.js Demo Loaded. Ready to draw!");
});
