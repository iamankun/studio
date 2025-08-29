    }

    // Tìm classes (nếu là file service)
    if (type === 'service') {
        // Regex đơn giản hóa để tránh catastrophic backtracking
        const classRegex = /class\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
        let classMatch;
        
        while ((classMatch = classRegex.exec(content)) !== null) {
            const className = classMatch[1];
            
            // Tìm extends và implements riêng biệt
            const extendsRegex = new RegExp(`class\\s+${className}\\s+extends\\s+([A-Za-z_$][A-Za-z0-9_$]*)`);
            const implementsRegex = new RegExp(`class\\s+${className}\\s+implements\\s+([A-Za-z_$][A-Za-z0-9_$]*)`);
            
            const extendsMatch = extendsRegex.exec(content);
            const implementsMatch = implementsRegex.exec(content);
            
            // Tìm class body đơn giản
            const classStartIndex = content.indexOf(`class ${className}`);
            const braceIndex = content.indexOf('{', classStartIndex);
            let braceCount = 1;
            let endIndex = braceIndex + 1;
            
            while (braceCount > 0 && endIndex < content.length) {
                if (content[endIndex] === '{') braceCount++;
                if (content[endIndex] === '}') braceCount--;
                endIndex++;
            }
            
            const classBody = content.substring(braceIndex + 1, endIndex - 1);