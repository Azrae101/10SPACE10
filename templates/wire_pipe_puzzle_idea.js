    <script>
        // Improved pipe puzzle functionality
        function rotatePipe(pipeElement) {
            const rotation = (parseInt(pipeElement.getAttribute('data-rotation')) + 90) % 360;
            pipeElement.setAttribute('data-rotation', rotation);
            pipeElement.style.transform = `rotate(${rotation}deg)`;
            
            // Update pipe connections visually
            updatePipeConnections();
        }

        function updatePipeConnections() {
            // Reset all pipe connection states
            document.querySelectorAll('.pipe').forEach(pipe => {
                pipe.classList.remove('connected');
            });
            
            // Check and visualize connections between pipes
            const pipes = Array.from(document.querySelectorAll('.pipe'));
            const rows = 2;
            const cols = 4;
            
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const index = row * cols + col;
                    const pipe = pipes[index];
                    if (!pipe) continue;
                    
                    const rotation = parseInt(pipe.getAttribute('data-rotation'));
                    const type = pipe.getAttribute('data-type');
                    
                    // Check connection to right neighbor
                    if (col < cols - 1) {
                        const rightPipe = pipes[index + 1];
                        const rightRotation = parseInt(rightPipe.getAttribute('data-rotation'));
                        const rightType = rightPipe.getAttribute('data-type');
                        
                        // Check if this pipe has a right opening and next pipe has a left opening
                        const hasRightOpening = hasOpening(type, rotation, 'right');
                        const hasLeftOpening = hasOpening(rightType, rightRotation, 'left');
                        
                        if (hasRightOpening && hasLeftOpening) {
                            pipe.classList.add('connected');
                            rightPipe.classList.add('connected');
                        }
                    }
                    
                    // Check connection to bottom neighbor
                    if (row < rows - 1) {
                        const bottomPipe = pipes[index + cols];
                        const bottomRotation = parseInt(bottomPipe.getAttribute('data-rotation'));
                        const bottomType = bottomPipe.getAttribute('data-type');
                        
                        // Check if this pipe has a bottom opening and next pipe has a top opening
                        const hasBottomOpening = hasOpening(type, rotation, 'bottom');
                        const hasTopOpening = hasOpening(bottomType, bottomRotation, 'top');
                        
                        if (hasBottomOpening && hasTopOpening) {
                            pipe.classList.add('connected');
                            bottomPipe.classList.add('connected');
                        }
                    }
                }
            }
        }

        function hasOpening(pipeType, rotation, direction) {
            // Normalize direction based on rotation
            const normalizedDir = normalizeDirection(direction, rotation);
            
            switch(pipeType) {
                case 'horizontal':
                    return normalizedDir === 'left' || normalizedDir === 'right';
                case 'vertical':
                    return normalizedDir === 'top' || normalizedDir === 'bottom';
                case 'corner':
                    // Corners have two openings depending on rotation
                    if (rotation === 0) return normalizedDir === 'right' || normalizedDir === 'bottom';
                    if (rotation === 90) return normalizedDir === 'top' || normalizedDir === 'right';
                    if (rotation === 180) return normalizedDir === 'top' || normalizedDir === 'left';
                    if (rotation === 270) return normalizedDir === 'left' || normalizedDir === 'bottom';
                    return false;
                default:
                    return false;
            }
        }

        function normalizeDirection(direction, rotation) {
            const directions = ['top', 'right', 'bottom', 'left'];
            const dirIndex = directions.indexOf(direction);
            if (dirIndex === -1) return direction;
            
            // Adjust based on rotation (90° steps)
            const rotations = rotation / 90;
            const newIndex = (dirIndex - rotations + 4) % 4;
            return directions[newIndex];
        }

        function checkPipeSolution() {
            // Check if all pipes are connected in a continuous path from left to right
            const pipes = Array.from(document.querySelectorAll('.pipe'));
            const connected = Array(8).fill(false);
            
            // Use BFS to check connectivity from left side to right side
            const queue = [];
            
            // Start with all left-side pipes that have a left opening
            for (let i = 0; i < 8; i += 4) {
                const pipe = pipes[i];
                const rotation = parseInt(pipe.getAttribute('data-rotation'));
                const type = pipe.getAttribute('data-type');
                
                if (hasOpening(type, rotation, 'left')) {
                    queue.push(i);
                    connected[i] = true;
                }
            }
            
            // Process the queue
            while (queue.length > 0) {
                const index = queue.shift();
                const pipe = pipes[index];
                const rotation = parseInt(pipe.getAttribute('data-rotation'));
                const type = pipe.getAttribute('data-type');
                
                // Check all four directions
                const row = Math.floor(index / 4);
                const col = index % 4;
                
                // Check right connection
                if (col < 3 && hasOpening(type, rotation, 'right')) {
                    const rightIndex = index + 1;
                    const rightPipe = pipes[rightIndex];
                    const rightRotation = parseInt(rightPipe.getAttribute('data-rotation'));
                    const rightType = rightPipe.getAttribute('data-type');
                    
                    if (hasOpening(rightType, rightRotation, 'left') && !connected[rightIndex]) {
                        connected[rightIndex] = true;
                        queue.push(rightIndex);
                    }
                }
                
                // Check left connection
                if (col > 0 && hasOpening(type, rotation, 'left')) {
                    const leftIndex = index - 1;
                    const leftPipe = pipes[leftIndex];
                    const leftRotation = parseInt(leftPipe.getAttribute('data-rotation'));
                    const leftType = leftPipe.getAttribute('data-type');
                    
                    if (hasOpening(leftType, leftRotation, 'right') && !connected[leftIndex]) {
                        connected[leftIndex] = true;
                        queue.push(leftIndex);
                    }
                }
                
                // Check bottom connection
                if (row < 1 && hasOpening(type, rotation, 'bottom')) {
                    const bottomIndex = index + 4;
                    const bottomPipe = pipes[bottomIndex];
                    const bottomRotation = parseInt(bottomPipe.getAttribute('data-rotation'));
                    const bottomType = bottomPipe.getAttribute('data-type');
                    
                    if (hasOpening(bottomType, bottomRotation, 'top') && !connected[bottomIndex]) {
                        connected[bottomIndex] = true;
                        queue.push(bottomIndex);
                    }
                }
                
                // Check top connection
                if (row > 0 && hasOpening(type, rotation, 'top')) {
                    const topIndex = index - 4;
                    const topPipe = pipes[topIndex];
                    const topRotation = parseInt(topPipe.getAttribute('data-rotation'));
                    const topType = topPipe.getAttribute('data-type');
                    
                    if (hasOpening(topType, topRotation, 'bottom') && !connected[topIndex]) {
                        connected[topIndex] = true;
                        queue.push(topIndex);
                    }
                }
            }
            
            // Check if any right-side pipe is connected and has a right opening
            let rightConnected = false;
            for (let i = 3; i < 8; i += 4) {
                if (connected[i]) {
                    const pipe = pipes[i];
                    const rotation = parseInt(pipe.getAttribute('data-rotation'));
                    const type = pipe.getAttribute('data-type');
                    
                    if (hasOpening(type, rotation, 'right')) {
                        rightConnected = true;
                        break;
                    }
                }
            }
            
            const allConnected = connected.every((val, i) => {
                // Pipes don't necessarily all need to be connected, just need a path
                // But for this puzzle, we'll require all to be connected
                return val;
            });
            
            if (allConnected && rightConnected) {
                document.getElementById('pipeFeedback').textContent = "Pipe system aligned! Coolant is flowing properly.";
                document.getElementById('pipeFeedback').style.color = '#7cb342';
                gameState.pipePuzzleSolved = true;
                setTimeout(() => {
                    pipePuzzleModal.style.display = 'none';
                    updateTerminal("> Pipe system aligned! Coolant is now flowing properly.");
                    saveGameState();
                    
                    if (gameState.wirePuzzleSolved) {
                        updateTerminal("> Both puzzles solved! You can now activate the safety switch.");
                    }
                }, 1500);
            } else {
                document.getElementById('pipeFeedback').textContent = "Pipes are not properly connected. Ensure a continuous path from left to right.";
                document.getElementById('pipeFeedback').style.color = '#ff2c7d';
            }
        }

        // Improved wire puzzle functionality
        let selectedWire = null;
        
        function setupWirePuzzle() {
            const wireNodes = document.querySelectorAll('.wire-node');
            wireNodes.forEach(node => {
                node.addEventListener('click', handleWireClick);
            });
            
            redrawWireConnections();
        }
        
        function handleWireClick(e) {
            const node = e.target;
            
            if (node.classList.contains('left')) {
                // Selecting a left node
                if (selectedWire) {
                    selectedWire.classList.remove('selected');
                }
                selectedWire = node;
                node.classList.add('selected');
                
                // Show tooltip
                const tooltip = document.getElementById('connection-tooltip');
                tooltip.textContent = `Selected ${node.getAttribute('data-color')} wire. Click a right connector to link.`;
                tooltip.style.display = 'block';
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY + 10) + 'px';
            } 
            else if (node.classList.contains('right')) {
                // Clicking on a right node
                if (selectedWire) {
                    // Create a connection
                    const leftId = selectedWire.getAttribute('data-id');
                    const rightId = node.getAttribute('data-id');
                    const leftColor = selectedWire.getAttribute('data-color');
                    const rightColor = node.getAttribute('data-color');
                    
                    // Remove any existing connection for this left node
                    gameState.wireConnections = gameState.wireConnections.filter(conn => conn.leftId !== leftId);
                    // Remove any existing connection for this right node
                    gameState.wireConnections = gameState.wireConnections.filter(conn => conn.rightId !== rightId);
                    
                    // Add new connection
                    gameState.wireConnections.push({
                        leftId: leftId,
                        rightId: rightId,
                        leftColor: leftColor,
                        rightColor: rightColor
                    });
                    
                    selectedWire.classList.remove('selected');
                    selectedWire = null;
                    redrawWireConnections();
                    
                    // Hide tooltip
                    document.getElementById('connection-tooltip').style.display = 'none';
                }
            }
            
            // Check if clicking on an existing connection (to remove it)
            if (!selectedWire && node.classList.contains('wire-connection')) {
                const leftId = node.getAttribute('data-left-id');
                const rightId = node.getAttribute('data-right-id');
                
                // Remove this connection
                gameState.wireConnections = gameState.wireConnections.filter(conn => 
                    !(conn.leftId === leftId && conn.rightId === rightId)
                );
                
                redrawWireConnections();
            }
        }
        
        function redrawWireConnections() {
            const wireContainer = document.getElementById('wire-connections');
            wireContainer.innerHTML = '';
            
            gameState.wireConnections.forEach(conn => {
                const leftNode = document.querySelector(`.wire-node[data-id="${conn.leftId}"]`);
                const rightNode = document.querySelector(`.wire-node[data-id="${conn.rightId}"]`);
                
                if (leftNode && rightNode) {
                    const leftRect = leftNode.getBoundingClientRect();
                    const rightRect = rightNode.getBoundingClientRect();
                    const containerRect = wireContainer.getBoundingClientRect();
                    
                    const leftX = leftRect.left + leftRect.width - containerRect.left;
                    const leftY = leftRect.top + leftRect.height/2 - containerRect.top;
                    const rightX = rightRect.left - containerRect.left;
                    const rightY = rightRect.top + rightRect.height/2 - containerRect.top;
                    
                    const distance = Math.sqrt(Math.pow(rightX - leftX, 2) + Math.pow(rightY - leftY, 2));
                    const angle = Math.atan2(rightY - leftY, rightX - leftX) * 180 / Math.PI;
                    
                    const wire = document.createElement('div');
                    wire.className = 'wire-connection';
                    wire.style.width = `${distance}px`;
                    wire.style.left = `${leftX}px`;
                    wire.style.top = `${leftY}px`;
                    wire.style.transform = `rotate(${angle}deg)`;
                    wire.style.backgroundColor = conn.leftColor === conn.rightColor ? '#7cb342' : '#ff2c7d';
                    wire.setAttribute('data-left-id', conn.leftId);
                    wire.setAttribute('data-right-id', conn.rightId);
                    
                    // Make connection clickable for removal
                    wire.style.pointerEvents = 'auto';
                    wire.style.cursor = 'pointer';
                    wire.title = 'Click to remove connection';
                    
                    wireContainer.appendChild(wire);
                }
            });
        }
        
        function checkWireSolution() {
            // Check if all wires are connected correctly (matching colors)
            const allCorrect = gameState.wireConnections.length === 4 && 
                gameState.wireConnections.every(conn => conn.leftColor === conn.rightColor);
            
            if (allCorrect) {
                document.getElementById('wireFeedback').textContent = "Wire connections verified! Power is restored.";
                document.getElementById('wireFeedback').style.color = '#7cb342';
                gameState.wirePuzzleSolved = true;
                setTimeout(() => {
                    wirePuzzleModal.style.display = 'none';
                    updateTerminal("> Wire connections verified! Power is restored.");
                    saveGameState();
                    
                    if (gameState.pipePuzzleSolved) {
                        updateTerminal("> Both puzzles solved! You can now activate the safety switch.");
                    }
                }, 1500);
            } else {
                document.getElementById('wireFeedback').textContent = "Some wire connections are incorrect. Colors must match.";
                document.getElementById('wireFeedback').style.color = '#ff2c7d';
            }
        }

        // Update the interactWithObject function to initialize the wire puzzle
        function interactWithObject(obj) {
            switch (obj.type) {
                // Other cases remain the same
                
                case 'wire_puzzle':
                    wirePuzzleModal.style.display = 'block';
                    // Initialize wire puzzle
                    setTimeout(setupWirePuzzle, 100);
                    break;
                    
                case 'pipe_puzzle':
                    pipePuzzleModal.style.display = 'block';
                    // Initialize pipe connections
                    setTimeout(updatePipeConnections, 100);
                    break;
                    
                // Other cases remain the same
            }
        }

        // Update the existing pipe puzzle event listeners
        document.querySelectorAll('.pipe').forEach(pipe => {
            pipe.addEventListener('click', function() {
                rotatePipe(this);
            });
        });

        // Update the check buttons
        checkPipesBtn.addEventListener('click', checkPipeSolution);
        checkWiresBtn.addEventListener('click', checkWireSolution);

        // Initialize the game (existing code)
        // ... (rest of the existing code)
    </script>
</body>
</html>